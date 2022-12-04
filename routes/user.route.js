const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../model/User.model.js");
const jwt = require("jsonwebtoken");
const jwtKey = "@420";

const date = new Date();

const userController = express.Router();

//for Signup
userController.post("/reg", (req, res) => {
  const payload = req.body;
  const { email, password } = payload;

  bcrypt.hash(password, 8, async function (error, hashed_pass) {
    if (error) {
      console.log("Something went wrong, Please try again");
    } else {
      const user = new UserModel({
        email,
        password: hashed_pass,
        Incorrect_Count : 0,
        current_hour : 0,
        current_minute : 0,
      });
      await user.save();
      res.send("Register Successful");
    }
  });
});



userController.post("/login", async(req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.send({ msg: "Invalid Credentials" });
  }
  const hashed_pass = user.password;
  const userId = user._id;
  bcrypt.compare(password, hashed_pass, async function (err, result) {
    if (
      result &&
      user.Incorrect_Count < 4 &&
      ((user.current_hour == 0 && (user.current_minute = 0)) ||
        (user.current_hour - date.getHours() <= 0 &&
          user.current_minute - date.getMinutes() <= 0))
    ) {
      const token = jwt.sign({ email, userId }, jwtKey);
      user.Incorrect_Count = 0;
    //   user.current_hour = 0;
    //   user.current_minute = 0;
      await user.save();
      return res.send({ msg: "login Success", token: token });
    }
    
    else if(user.Incorrect_Count >= 4){
        const hours = date.getHours();
        const min = date.getMinutes()
        user.current_hour = hours;
        user.current_minute = min;
        await user.save()

        return res.send({msg : "Password was wrong for 5 times, you can come back after 24hrs"})

    }
    
    
    else {
      user.Incorrect_Count++;
      await user.save();

      return res.send({
        msg: "Incorrect Password",
        user: user.Incorrect_Count,
      });
    }
  });
});

module.exports = userController;


