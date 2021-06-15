const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");

const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
//const MongoStore = require("connect-mongo")(session);

app.use(expressLayouts);
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(`${__dirname}/assets`));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "instagram-clone",
    // TODO change the secret before deployment in production mode
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    // store: new MongoStore(
    //   {
    //     mongooseConnection: db,
    //     autoRemove: "disabled",
    //   },
    // function(err) {
    //   console.log(err || "connect-mongodb setup ok");
    // },
  })
);

//app.use(passport.setAuthenticatedUser);
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace("<password>", process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log("connection made to database");
  });

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
// app.use(passport.setAuthenticatedUser);
app.use("/", require("./routes"));
//for all unhandled routes

app.listen(port, function (err) {
  if (err) console.log("error in server");
  console.log(`server running on ${port}`);
});
