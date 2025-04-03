const express = require("express");
const path = require("path");
const app = express();
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const bodyParser = require("body-parser");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));


// View engine setup
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));

app.use(
    session({
      secret: "secureSecretKey",
      resave: false,
      saveUninitialized: true,
    })
  );

// Load Routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");

app.use("/", authRoutes);
app.use("/courses", courseRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);

// Default route
app.get("/", (req, res) => {
    res.redirect("/courses");
  });
  
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
  });

// Start server
app.listen(3000,() =>{
console.log("Server listening on port: 3000");
});