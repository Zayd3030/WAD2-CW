const express = require("express");
const path = require("path");
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));
app.use(bodyParser.urlencoded({ extended: false }));

// Session setup
app.use(
  session({
    secret: "secureSecretKey",
    resave: false,
    saveUninitialized: true,
  })
);

// Inject session user into all views
app.use((req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = {
      username: req.session.user.username,
      isOrganiser: req.session.user.role === "organiser",
    };
  } else {
    res.locals.user = null;
  }
  next();
});

// View engine setup
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));

// Routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const guestRoutes = require("./routes/guestRoutes");

app.use("/", authRoutes);
app.use("/courses", courseRoutes);
app.use("/admin", adminRoutes);
app.use("/guest", guestRoutes);

// Default redirect
app.get("/", (req, res) => {
  res.redirect("/courses");
});

// Start server
app.listen(3000, () => {
  console.log("Server listening on port: 3000");
});
