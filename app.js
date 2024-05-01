const express = require("express");
const path = require("path");
const userModel = require("./model/user");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/create", (req, res) => {
  let { username, email, password } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
        username,
        email,
        password: hash,
      });
      let token = jwt.sign({ email }, "secret");
      res.cookie("accessToken", token);
      res.send(createdUser);
    });
  });
});

app.listen(3000, () => {
  console.log("listening to port 3000");
});
