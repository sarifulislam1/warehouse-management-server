// sariful
// EKLGR6ar55WFnzUB

const express = require("express")
const app = express()
const port = 4000
const cors = require("cors")

app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sariful:EKLGR6ar55WFnzUB@cluster0.pni7z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     // client.close();
//     console.log('connected to db');
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

        //create post
        app.post('/item', async (req, res) => {
            const data = req.body
            console.log(data);
            const result = await itemCollection.insertOne(data)

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