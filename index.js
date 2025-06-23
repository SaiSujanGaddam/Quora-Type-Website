const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");

const methodOver= require("method-override");

app.use(methodOver("_method"));
app.use(express.urlencoded( { extended : true}));

const port =    8080;

app.set("view engine","ejs");
app.use("views",path.join(__dirname,"/views"))

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : "delta_app",
    password : "sainilayam"
});
// The Below getRandomUser gives out an array of random values
let getRandomUser= () => {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),     
      faker.internet.password(),
    ];
  }

  // Inserting data, Once you insert into table then you can delete this piece of code

  let q =  "INSERT INTO user (id,username,email,password) VALUES ?";

  let data=[];
  for(let i=0;i<100;i++){
    data.push(getRandomUser());
  }
  

    // Here the below is used to do the operation by taking the query 
try{
    connection.query(q,[data], (err,result)=>{ // here we wrote q,[data] means the question marks in q will be replaced with data
        if(err) throw err;
    });  
}catch(err){
    console.log(err);
}

connection.end();



// From Here is just the express which we had already learnt in Quora activity
app.listen(port,()=>{
    console.log(`Server is listening to port : ${port}`);
});
// Home route
app.get("/",(res,req)=>{

    let q= `SELECT COUNT(*) FROM user`; 
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let count = result[0]["count(*)"]; // Here as result contains an array which contains object that contains the count so we are de structuring it
            res.render("home.ejs",{count});
        });  
    }catch(err){
        console.log(err);
    }

    connection.end();
});

app.get("/user",(req,res)=>{
    let q= `SELECT * FROM user`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            res.render("showusers.ejs",{users});
        });  
    }catch(err){
        console.log(err);
    }

    connection.end();
});

app.get("user/:id/edit",(req,res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`; 
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user= result[0];
            res.render("edit.ejs",{user});
        });  
    }catch(err){
        console.log(err);
    }

    connection.end();
});

app.patch("user/:id",(req,res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`; 
    let user= result[0];
    let{password: formPass,username : newUsername} = req.body;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            if(formPass!=user.password){
                res.send("Wrong password");
            }else{
                let q2 = `UPDATE user SET username '${newUsername}' WHERE id ='${id}'`;
                connection.query(q2,(err,result)=>{
                    if(err) throw err;
                    req.redirect("/user")
                });
            }
        });  
    }catch(err){
        console.log(err);
    }

    connection.end();
});