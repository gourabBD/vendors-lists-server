const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


require('dotenv').config();

//middle wares
app.use(cors());
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.m8joqcm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
  try{
     const usersCollection= client.db('jsTigers').collection('users');
     
      
   
     app.get('/vendors',async(req,res)=>{
      const query={}
      const cursor=usersCollection.find(query)
      const services=await cursor.toArray();
      
      res.send(services)
     })
     app.get('/vendors/count',async(req,res)=>{
      const page=parseInt(req.query.page )
      const size= parseInt(req.query.size )
      const query={}
      const cursor=usersCollection.find(query).sort({_id:-1})
      const services=await cursor.skip(page*size).limit(size).toArray();
      const count=await usersCollection.estimatedDocumentCount()
      res.send({count,services})
     })
     app.post('/vendors' , async(req,res)=>{
        const order=req.body;
        const result=await usersCollection.insertOne(order)
        res.send(result)
       })
       app.get(`/vendors/:id`,async(req,res)=>{
        const id=req.params.id;
        const query={_id: ObjectId(id)}
        const result = await usersCollection.findOne(query);
        res.send(result)
       })

      app.patch('/vendors/:id',async(req,res)=>{
  const id= req.params.id;
  const name = req.body.name
  const accountNumber = req.body.accountNumber
  const bankName = req.body.bankName
  const addressOne = req.body.addressOne
  const addressTwo = req.body.addressTwo
  const city = req.body.city
  const country = req.body.country
  const zip = req.body.zip
  
  const query={_id : ObjectId(id)}
  const updateDoc={
    $set:{
      name: name,
      accountNumber: accountNumber,
      bankName: bankName,
      addressOne: addressOne,
      addressTwo: addressTwo,
      city: city,
      country: country,
      zip: zip,


    }
  
  }
  const result =await usersCollection.updateOne(query,updateDoc)
  res.send(result)
 })
       app.delete('/vendors/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id: ObjectId(id)}
        const result=await usersCollection.deleteOne(query)
        res.send(result)
       })
    
  }
  finally{

  }

}
run().catch(err=>console.error(err))




app.get('/', (req, res) => {
  res.send('JS Tigers server running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})