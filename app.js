const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const express = require("express");
const app = express();

const errorMiddleware = require("./middleware/error");
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/striperoute");
const contact = require("./routes/contactRoute");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
require("dotenv").config();
require("./utils/passport");

//initial config
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

//session config
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      // domain: process.env.NODE_ENV === "development" ? "localhost" : "gga",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    store: MongoStore.create({
      mongoUrl: process.env.DB_URI,
      ttl: 7 * 24 * 60 * 60,
    }),
  })
);

//passport-js config
app.use(passport.initialize());
app.use(passport.session());

//cors config
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://greenglobalaggrovationfrontend.onrender.com",
      "https://greenglobalaggrovation.com",
    ],
  })
);

//route imports
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
// app.use("/api/v1", payment);
app.use("/api/v1", contact);
app.use("/api/v1", payment);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("*", (req, res, next) => {
  res.status(200).json({
    message: "bad request",
  });
});
app.use(errorMiddleware);

module.exports = app;
