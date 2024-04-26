const express = require('express')
const  cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware

app.use(cors())
app.use(express.json());
// tourServer
// 7cXrAXmSnXOdWczZ



// const uri = `mongodb+srv://<username>:<password>@cluster0.ejfr6xk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const uri = `mongodb+srv://tourServer:7cXrAXmSnXOdWczZ@cluster0.ejfr6xk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    const tourCollection = client.db("TourismDB").collection("tour");

    // create a post
    app.post('/allTour', async(req, res)=>{
      const cursor = req.body
      const result = await tourCollection.insertOne(cursor)
      res.send(result)
    })
    // read by email
    app.get('/allTour/:email', async(req, res) => {
      const email = req.params.email
      console.log(email)
      const query = { email: email };
      const result = await tourCollection.find(query).toArray();
      res.send(result)
    })

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
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})