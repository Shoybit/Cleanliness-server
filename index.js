const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 3000
require('dotenv').config();
app.use(cors())
app.use(express.json())




  
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lnfp781.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    //api added 
    const db = client.db('cleanliness-db')
    const cleansCollection = db.collection('cleans')

    // collection api 
    const contributionsCollection = db.collection('contributions');

    // User Collection 
    const usersCollection = db.collection('users');



//letes 6 data 
app.get('/letest-cleans', async (req , res ) => {
const result = await cleansCollection.find().sort({created_at: -1 }).limit(6).toArray()
  res.send(result)
})

//letes details 
app.get('/letest-cleans/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const issue = await cleansCollection.findOne({ _id: new ObjectId(id) });
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// contributionsCollection post

app.post('/contributions', async (req, res) => {
  try {
    const data = req.body; 
    data.date = new Date(); 
    const result = await contributionsCollection.insertOne(data);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Contribution save faild' });
  }
});


// contributionsCollection / get

app.get('/contributions/:issueId', async (req, res) => {
  const { issueId } = req.params;
  try {
    const contributions = await contributionsCollection.find({ issueId }).toArray();
    res.json(contributions);
  } catch (err) {
    res.status(500).json({ message: 'Contributions fetch faild' });
  }
});

// get all issues api

app.get('/all-api', async (req, res) => {
  try {
    const result = await cleansCollection.find().toArray(); 
    res.send(result); 
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch data" });
  }
});


// addissue


    app.post('/addissue', async (req,res) => {

      const data = req.body
    const newModel = {
      ...data,
      created_at: new Date() 
    };
    //
      console.log(data);
      const result = await cleansCollection.insertOne(newModel)

      res.send({
        success: true,
        result
      })
    })


 // My Issues
    app.get('/my-issues', async (req, res) => {
      const email = req.query.userEmail;
      if (!email) return res.status(400).send({ error: "User email required" });
      try {
        const issues = await cleansCollection.find({ email }).toArray();
        res.json(issues);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch issues" });
      }
    });

    // Update issue
    app.put('/issues/:id', async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      try {
        const result = await cleansCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );
        res.json({ success: true, result });
      } catch (err) {
        res.status(500).json({ success: false, message: "Update failed" });
      }
    });

    // Delete issue
    app.delete('/issues/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const result = await cleansCollection.deleteOne({ _id: new ObjectId(id) });
        res.json({ success: true, result });
      } catch (err) {
        res.status(500).json({ success: false, message: "Delete failed" });
      }
    });

    // 

  // My contributions 
    app.get('/contributions', async (req, res) => {
      const { email } = req.query; 
      if (!email) return res.status(400).json({ message: "email query required" });

      try {
        const contributions = await contributionsCollection.find({ email }).toArray();
        res.json(contributions);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed Contributions" });
      }
    });


app.post('/users', async (req, res) => {
  const { name, email } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return res.send({ message: 'User already exists' });
  }

  const newUser = {
    name: name || "Anonymous",
    email,
    role: 'user',
    createdAt: new Date(),
  };

  const result = await usersCollection.insertOne(newUser);
  res.send(result);
});


// Admin login 

app.patch('/users/admin/:email', async (req, res) => {
  const email = req.params.email;

  const result = await usersCollection.updateOne(
    { email },
    { $set: { role: 'admin' } }
  );

  res.send(result);
});

// get user role
app.get('/users/role/:email', async (req, res) => {
  const email = req.params.email;
  const user = await usersCollection.findOne({ email });
  res.send({ role: user?.role || 'user' });
});


// get all users (admin)
app.get('/users', async (req, res) => {
  const users = await usersCollection.find().toArray();
  res.send(users);
});



// dashboard stats
app.get('/dashboard/stats', async (req, res) => {
  const totalIssues = await cleansCollection.countDocuments();

  const pendingIssues = await cleansCollection.countDocuments({
    status: "ongoing",
  });

  const resolvedIssues = await cleansCollection.countDocuments({
    status: "ended",
  });

  const byCategory = await cleansCollection.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]).toArray();

  res.send({
    total: totalIssues,
    pending: pendingIssues,
    resolved: resolvedIssues,
    byCategory: byCategory.map(item => ({
      category: item._id,
      count: item.count,
    })),
  });
});


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is Running !')
})

app.listen(port, () => {
  console.log(`Servern is listening on port ${port}`)
})
