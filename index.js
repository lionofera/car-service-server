const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.l2v4npf.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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
    const serviceCollection = client.db('geniuscar').collection('services');
    const orderCollection = client.db('geniuscar').collection('orders');
    
    app.get('/services', async(req, res) => {
        const query = {}
        const cursor = serviceCollection.find(query)
        const services = await cursor.toArray()
        res.send(services)
    })

    app.get('/services/:id', async(req,res) =>{
        const id = req.params.id;
        const query = {_id:new ObjectId(id)}
        const service = await serviceCollection.findOne(query)
        res.send(service);
    })


    app.get('/orders', async(req, res) => {
        let query = {};
        if(req.query.email) {
            query = {
                email: req.query.email
            }
        }
        const cursor = orderCollection.find(query);
        const orders = await cursor.toArray();
        res.send(orders);
    })


    app.post('/orders', async(req, res) => {
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.send(result);

    })

    app.delete('/orders/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await orderCollection.deleteOne(query);
      res.send(result);

    })
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server running on port, ${port}`)
})
