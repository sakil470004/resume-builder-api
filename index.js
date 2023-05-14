const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config()
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.PASSWORD}@cluster0.bpciahf.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        //? connect client to server
        await client.connect();
        console.log('mongo connected')

        const resumeCollection = client.db("ResumeDB").collection('ResumeDetails');

        // get all resume
        app.get('/resume/:id', async (req, res) => {
            const id = req.params.id;
            const cursor = await resumeCollection.find({ userId: new ObjectId(id) });
            const resumes = cursor.toArray();
            res.send(resumes);
        })
        // add single resume
        app.post('/addresume', async (req, res) => {
            //? get data from body
            const resume = req.body;
            const result = await resumeCollection.insertOne(resume);
            res.send(result)

        })
    } finally {
        //? ensure clint is closed
        // await client.close();
    }
}
run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('Resume server is running')
})
app.listen(port, () => {
    console.log(`Server is running is port ${port}`)
})