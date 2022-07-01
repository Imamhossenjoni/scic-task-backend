const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors())
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Successfully conected Bro!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.idchp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const listsCollection = client.db('dbuser1').collection('lists');
        const addCollection = client.db('dbuser1').collection('add');
        
        
        //lists post 
        app.post('/lists', async (req, res) => {
            const review = req.body;
            const result = await listsCollection.insertOne(review);
            res.send(result);
        })
 
        //lists get
        app.get('/lists', async(req, res) => {
            const query = {};
            // const review=req.body;
            const result = await listsCollection.find(query).toArray();
            res.send(result);
        })
        //lists update
        app.get('/lists/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result=await listsCollection.findOne(query);
            res.send(result);
        })
        //update user
        app.put('/lists/:id',async(req,res)=>{
            const id=req.params.id;
            const updatedValue=req.body;
            const filter={_id:ObjectId(id)};
            const options={upsert:true};
            const updatedDoc={
                $set:{
                    value:updatedValue.value
                }
            };
            const result=await listsCollection.updateOne(filter,updatedDoc,options);
            res.send(result);
        })
               //add post
               app.post('/add',async(req,res)=>{
                const add=req.body;
                const result=await addCollection.insertOne(add);
                res.send(result);
            })
            //add get
            app.get('/add',async(req,res)=>{
                const query={};
                const result=await addCollection.find(query).toArray();
                res.send(result);
            })
    }
    finally {
        //    await client.close()
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('Listening from port', port);
})
