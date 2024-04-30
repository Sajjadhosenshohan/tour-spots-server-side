const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware

app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ejfr6xk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
console.log(uri)
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

    const tourCollection = client.db("TourismDB").collection("tour");
    const countriesCollection = client.db("TourismDB").collection("countries");
    

    // create a post
    app.post('/allTour', async (req, res) => {
      const cursor = req.body
      const result = await tourCollection.insertOne(cursor)
      res.send(result)
    })
    // read all
    app.get('/allTour', async (req, res) => {
      const cursor = tourCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // // read by email
    app.get('/myList/:email', async (req, res) => {
      const email = req.params.email
      console.log(email)
      const query = { email: (email) };
      const result = await tourCollection.find(query).toArray();
      // console.log(result)
      res.send(result)
    })
    // read a item
    app.get('/views/:id', async (req, res) => {
      const id = req.params.id
      const cursor = { _id: new ObjectId(id) }
      const result = await tourCollection.findOne(cursor);
      res.send(result)
    })


    // delete
    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id

      const query = { _id: new ObjectId(id) };


      const result = await tourCollection.deleteOne(query);

      res.send(result)
    })
    // update
    app.get('/update/:id', async (req, res) => {
      const id = req.params.id
      const cursor = { _id: new ObjectId(id) }
      const result = await tourCollection.findOne(cursor);
      res.send(result)
    })
    // update 
    app.put('/update/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) };
      const updateOne = req.body;
      const options = { upsert: true };
      // Specify the update to set a value for the plot field
      const update = {
        $set: {
          name: updateOne.name,
          email: updateOne.email,
          tourists_spot_name: updateOne.tourists_spot_name,
          country_Name: updateOne.country_Name,
          location: updateOne.location,
          average_cost: updateOne.average_cost,
          totalVisitorsPerYear: updateOne.totalVisitorsPerYear,
          travel_time: updateOne.travel_time,
          seasonality: updateOne.seasonality,
          short_description: updateOne.short_description,
          image: updateOne.image,
        },
      };
      // Update the first document that matches the filter
      const result = await tourCollection.updateOne(filter, update, options);

      res.send(result)
    })

    // get countries data
    // 
    app.get('/countriesData', async (req, res) => {
      const cursor = countriesCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })


    // await client.db("admin").command({ ping: 1 });
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