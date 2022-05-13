const express = require("express");
const app = express();
require("./db/conn"); //include db connection
const userSchema = require("./models/usersSchema"); // put name as userSchema
const postSchema = require("./models/postsSchema");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// User registration
app.post("/register", async (req, res) => {
  try {
    const new_register = new userSchema(req.body);
    const token = await new_register.generateAuthToken();
    const reg = await new_register.save();
    res.status(201).send(reg);
  } catch (error) {
    res.status(400).send(error);
  }
});

// User Login
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const usermail = await userSchema.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, usermail.password);
    const token = await usermail.generateAuthToken();
    console.log(token);
    if (isMatch) {
      res.status(201).send("Login Successfully");
    } else {
      res.send("Invalid Username or Password");
    }
  } catch (error) {
    res.status(400).send("Invalid Username or Password");
  }
});

// User Logout
app.get("/logout", auth, async (req, res) => {
  try {
    /*For Single Logout
    req.user.tokens = req.user.tokens.filter((currElement)=>{
      return currElement.token !== req.token
    })*/

    // Logout from all devices
    req.user.tokens = [];
    res.clearCookie("jwt");
    await req.user.save();
    res.send("Logout Success");
  } catch (error) {
    res.status(500).send(error);
  }
});

// Posts User

app.post("/post_posts", auth, async (req, res) => {
  try {
    const userPost = new postSchema(req.body);
    const postu = await userPost.save();
    res.status(201).send(postu);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get Posts API
app.get("/get_posts", auth, async (req, res) => {
  try {
    const getUser = await postSchema.find({});
    res.status(201).send(getUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update Posts API
app.patch("/update_posts/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const postUpdate = await postSchema.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.send(postUpdate);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Delete Posts API
app.delete("/delete_posts/:id", auth, async (req, res) => {
  try {
    const del = await postSchema.findByIdAndDelete(req.params.id);
    res.send(del);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Count API
app.get("/posts/status", auth, async (req, res) => {
  try {
    const activeUsers = await postSchema.countDocuments({ status: "active" });
    const inactiveUsers = await postSchema.countDocuments({
      status: "inactive",
    });
    res.send(`Active Users ${activeUsers} Inactive Users ${inactiveUsers}`);
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`The Port is Running at ${port}`);
});
