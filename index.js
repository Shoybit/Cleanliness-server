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
    await client.connect();

    //api added 
    const db = client.db('cleanliness-db')
    const cleansCollection = db.collection('cleans')

    // collection api 
    const contributionsCollection = db.collection('contributions');



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


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
