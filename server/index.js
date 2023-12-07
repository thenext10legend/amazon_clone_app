console.log("Hello World"); //print("Hello  world");

const express=require('express');   //import '';

const PORT = 3000;

const app=express();

//CREATING AN API
// GET, PUT, POST, DELETE, UPDATE --> CRUD

//GET
// http://<youripaddress>/hell0-world
app.get("/hello-world",(req,res)=>{
    res.send("hello world");
})

app.get("/",(req,res)=>{
    res.json({"Name":"Shivam"});
})

app.listen(PORT,  ()=>{
    console.log(`connected at port ${PORT}...Bye`);
});

