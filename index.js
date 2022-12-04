const express = require("express");

const {connection} = require("./db/config");
const userController = require("./routes/user.route.js")


const cors = require("cors");



const app = express();
app.use(express.json());
app.use(cors());


app.get("/",(req,res) => {
    res.send("homepage")
})


app.use("/user", userController);




app.listen(process.env.PORT || 5000, async () =>{
    try{
        await connection;
        console.log("connection")
    }
    catch(e){
        console.log(e)
    }
    console.log("server running")
    
    });