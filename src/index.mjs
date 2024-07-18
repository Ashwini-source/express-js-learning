import express from 'express';

const app = express();

// Middleware to read JSON body 
app.use(express.json())

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Running on port ${PORT}`)
})

// Get Requests

let mockUsers = [
    {id:1, name:`Ashwini`, dispayName:`Ashwini Chauhan`},
    {id:2, name:`Shreyansh`, dispayName:`Shreyansh`},
    {id:3, name:`Sukrit`, dispayName:`Sukrit`},
    {id:4, name:`Sachin`, dispayName:`Sachin`},
    {id:5, name:`Balindam`, dispayName:`Balindam`},
    {id:6, name:`Rahul`, dispayName:`Rahul`},
    {id:7, name:`Prakul`, dispayName:`Prakul`},
]


app.get("/", (req, res)=>{
    res
        .status(201)
        .send({msg:`Hello, you are welcome to the learning center of express js`})
})

app.get("/api/products",(req,res)=>{
    res 
        .status(200)
        .send([
            {id:1,type:"Book",name:"Outlier"},
            {id:1,type:"Game",name:"Monopoly"},
            {id:1,type:"EGame",name:"FIFA"},
        ])
})

app.get("/api/users",(req, res)=>{
    console.log(req.query)
    const {
        query : {filter, value}
    } = req;
    if(filter && value){
        return res.status(200).send(mockUsers.filter((user)=> user[filter].toLowerCase().includes(value.toLowerCase())))
    }
    return res.status(200).send(mockUsers)
    
    
})

app.get("/api/users/:id",(req,res)=>{
    const parsedID = parseInt(req.params.id);
    if(isNaN(parsedID)){
        return res.status(400).send({msg:"Bad Request: Invalid ID"})
    }
    const findUser = mockUsers.find((user)=> user.id === parsedID)
    if(!findUser){
        return res.sendStatus(404)
    }
    return res.status(200).send(findUser ) 
})

// Post Requests
app.post("/api/users", (req, res)=>{
    const {body:{name, displayName}} = req;
    const newUser = {id: mockUsers[mockUsers.length-1].id +1, name: name, displayName:displayName};
    mockUsers.push(newUser);    
    return res.status(201).send(newUser);
})


// Put Requests - Update the whole record
app.put("/api/users/:id", (req,res)=>{
    const { body, params:{id}} = req;
    const parsedID = parseInt(id);
    if(isNaN(parsedID)){
        console.log("parsedID not correct")
        return res.sendStatus(400);
    }
    const findUserIndex = mockUsers.findIndex((user)=> user.id === parsedID);
    if(findUserIndex === -1){
        console.log("index not found")
        return res.sendStatus(404);
    }
    mockUsers[findUserIndex] = {id:parsedID, ...body};
    return res.sendStatus(200);
})

 
// Patch Requests - Update a part of the record
app.patch("/api/users/:id", (req,res)=>{
    const {body, params:{id}} = req;
    const parsedID = parseInt(id);
    if(isNaN(parsedID)){
        return res.sendStatus(404);
    }
    const findUserIndex = mockUsers.findIndex((user)=> user.id === parsedID);
    if(findUserIndex === -1){
        return res.sendStatus(404);
    }
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body};
    return res.sendStatus(200);
})

// Delete Requests
app.delete("/api/users/:id", (req,res)=>{
    const {params:{id}} = req;
    const parsedID = parseInt(id);
    if(isNaN(parsedID)){
        return res.sendStatus(404);
    }
    const findUserIndex = mockUsers.findIndex((user)=> user.id === parsedID);
    if(findUserIndex === -1){
        return res.sendStatus(404);
    }
    mockUsers.splice(findUserIndex,1);
    return res.sendStatus(200)
})