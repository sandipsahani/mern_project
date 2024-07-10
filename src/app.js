require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
require("./db/conn");
const bcrypt = require("bcryptjs");
const Register = require("./models/registers");
const jwt = require("jsonwebtoken")
const { json } = require("express")
const { log } = require("console")
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

console.log(process.env.SECRET_KEY)

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/register", async (req, res) => {
  res.render("register");
});
app.get("/login", async (req, res) => {
  res.render("login");
});

// create a new user in our database

app.post("/register", async (req, res) => {
  try {
    const requestBody = req.body;
    const password = requestBody.password;
    const cpassword = requestBody.confirmPassword;

    if (password === cpassword) {
      const registerEmployee = new Register({
        firstname: requestBody.firstname,
        lastname: requestBody.lastname,
        email: requestBody.email,
        password: password,
        confirmPassword: cpassword,
        phone: requestBody.phone,
        age: requestBody.age,
        gender: requestBody.gender,
      });
console.log("the success part"+ registerEmployee);

const token = await registerEmployee.generateAuthToken();
console.log("the token part" + token);
   const registeres =  await registerEmployee.save();
      res.status(201).render("index");
    } else {
      return res.send("password are not matching");
    }
  } catch  {
    res.status(400).send("invalid password");
  }
});
//login check
app.post("/login", async (req, res) => {
  
  try {
    const requestBody = req.body;
    const email = requestBody.email;
    const password = requestBody.password;
    const user = await Register.findOne({ email: email });
    const isMatch = await bcrypt.compare(password,user.password)
    const token = await user.generateAuthToken();
    console.log("the token part" + token);
   

  if (isMatch) {
    res.status(201).render("index");
  } else {
    res.send("invalid password details");
  }
  } catch (error) {
    res.status(400).send(error.message);
    }
});






 




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

