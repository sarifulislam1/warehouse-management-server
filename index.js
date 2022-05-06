// sariful
// EKLGR6ar55WFnzUB

const express = require("express")
const app = express()
const port = process.env.PORT || 4000
const cors = require("cors")
const jwt = require('jsonwebtoken');

require('dotenv').config()
app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pni7z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


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

        app.post('/login', async (req, res) => {
            const email = req.body

            const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {

            })

            res.send({ accessToken })
        })


        app.post('/item', async (req, res) => {
            const data = req.body
            const tokenInfo = req.headers.authorization
            console.log(tokenInfo);
            const [email, accessToken] = tokenInfo.split(" ")
            const decoded = verifyToken(accessToken)
            console.log(decoded);
            //jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            console.log(decoded);
            if (email === decoded.email) {
                const result = await itemCollection.insertOne(data)

                res.send(result)
            }
            else {
                req.send({ success: 'UnAuthorized Access' })
            }
        });
        //   require('crypto').randomBytes(256).toString('base64')
        app.get('/myItem', async (req, res) => {
            const tokenInfo = req.headers.authorization
            const [email, accessToken] = tokenInfo.split(" ")
            const decoded = verifyToken(accessToken)
            if (email === decoded.email) {

                const myItem = await itemCollection.find({ email: email }).toArray();
                res.send(myItem);
            }
            else {
                res.send({ success: 'UnAuthorized Access' })
            }


        })

        console.log('all api working');
        app.put('/item/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: data.quantity

                }
            };
            const result = await itemCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

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

function verifyToken(token) {
    let email;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            email = 'Invalid'
        }
        console.log(decoded);
        if (decoded) {
            email = decoded
        }
    })
    return email
}