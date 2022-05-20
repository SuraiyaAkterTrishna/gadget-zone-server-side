const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ihjhq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const itemCollection = client.db('warehouseData1').collection('item');

        // create item
        app.post('/item', async (req, res)=>{
            const item = req.body;
            const result = await itemCollection.insertOne(item);
            res.send(result);
        });

        // get item
        app.get('/item', async(req, res)=>{
            const query = {};
            const cursor = itemCollection.find(query);
            const item = await cursor.toArray();
            res.send(item);
        });

        // update item
        app.put('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const updateItem = req.body;
            console.log(id);
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true};
            const updateDoc = {
                $set: {
                    name: updateItem.name,
                    image: updateItem.image,
                    description: updateItem.description,
                    price: updateItem.price,
                    quantity: updateItem.quantity,
                    supplierName: updateItem.supplierName
                }
            };
            const result = await itemCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.get('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemCollection.findOne(query);
            res.send(result);
        })

        // delete item
        app.delete('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{}
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('warehouse is running')
})

app.listen(port, ()=>{
    console.log('warehouse is running on port', port)
})

