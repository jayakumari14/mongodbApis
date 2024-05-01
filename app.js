const express = require("express");
const path = require("path");
const userModel = require("./model/user");
const postModel = require("./model/posts");
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

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) return res.status(401).send("Something went wrong");
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) res.status(200).send("you can login");
    else res.redirect("/login");
  });
});

app.post("/register", async (req, res) => {
  let { username, name, age, email, password } = req.body;

  let user = await userModel.findOne({ email });

  if (user) return res.status(500).send("User already registered");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await userModel.create({
        username,
        name,
        age,
        email,
        password: hash,
      });

      let token = jwt.sign({ email, userId: user._id }, "secret");
      res.cookie("accessToken", token);

      res.send("registered");
    });
  });
});

app.listen(3000, () => {
  console.log("listening to port 3000");
});
