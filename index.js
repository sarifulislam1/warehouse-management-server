// sariful
// EKLGR6ar55WFnzUB

const express = require("express")
const app = express()
const port = process.env.PORT || 4000
const cors = require("cors")

require('dotenv').config()
app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pni7z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     // client.close();
//     console.log('connected to db'); upadet this
// });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db("itemsInfo").collection("items");
        app.get('/items', async (req, res) => {

            const q = req.query
            const cursor = itemCollection.find(q)
            const result = await cursor.toArray()

            res.send(result)



        })
        //all items
        // http://localhost:4000/items

        //post api
        //http://localhost:4000/item

        //put api
        //http://localhost:4000/item/626cfcfe3751a119d5c7673a

        //create post
        app.post('/item', async (req, res) => {
            const data = req.body
            console.log(data);
            const result = await itemCollection.insertOne(data)

            res.send(result)
        });

        app.put('/item/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    name: data.name,
                    price: data.price,
                    img: data.img,
                    description: data.description,
                    quantity: data.quantity,
                    supplierName: data.supplierName,

                },
            };
            const result = await itemCollection.updateOne(filter, updateDoc, options);
            res.send(result)

        })

        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.findOne(query);
            res.send(result);
        });

        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }

            const result = itemCollection.deleteOne(filter)
            res.send(result)
        })

    } finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('hello world')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});