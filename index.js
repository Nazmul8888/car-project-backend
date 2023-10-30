const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5001;


app.use(cors());
app.use(express.json());

// id -doctor pass- o0rT4gCBDiotFBcV

console.log(process.env.DB_PASS)




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6nodxbc.mongodb.net/?retryWrites=true&w=majority`;

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


    const servicesCollection = client.db('doctor').collection('services');
    const checkOutCollection = client.db('doctor').collection('checkout')

    app.get('/services', async(req,res)=>{
      const cursor = servicesCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    app.get('/services/:id', async(req,res)=>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}

      const options = {
        projection: {title:1,price:1, img:1, services_id: 1}
      }
      const result = await servicesCollection.findOne(query,options)
      res.send(result)
    })


  //  checkout 


    app.get('/checkout', async (req,res)=>{
    console.log(req.query.email)
    let query = {};
    if(req.query?.email){
      query = {email: req.query.email}
    }
      const result = await checkOutCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/checkout', async (req,res)=>{
      const order = req.body;
      console.log(order);
      const result = await checkOutCollection.insertOne(order)
      res.send(result);

    })

    app.patch('/checkout/:id', async(req,res)=>{
      const updateCheckout =req.body;
      console.log(updateCheckout);
    })

    app.delete('/checkout/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await checkOutCollection.deleteOne(query)
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



app.get('/',(req,res)=>{
    res.send('doctor is coming')
})

app.listen(port,()=>{
    console.log(`server is coming on port: ${port}`)

})