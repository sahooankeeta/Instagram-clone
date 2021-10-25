const http = require("http");
const express = require("express");

const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const app = express();
const port = 8000;

const server = http.createServer(app);
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongo");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const passportGithub = require("./config/passport-github-auth-strategy");
const chatServer = http.Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
//console.log("chat running on 5000");
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace("<password>", process.env.PASSWORD);
const flash = require("connect-flash");
const customMware = require("./config/middleware");

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log("connection made to database");
  });

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static(`${__dirname}/assets`));
app.use(expressLayouts);
app.use("/uploads", express.static(__dirname + "/uploads"));

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
    store: MongoStore.create({
      mongoUrl: DB,
    }),
  })
);

//app.use(passport.setAuthenticatedUser);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
// app.use(passport.setAuthenticatedUser);
app.use("/", require("./routes"));
//for all unhandled routes
app.all("*", (req, res, next) => res.redirect("/sign-out"));
server.listen(port, function (err) {
  if (err) console.log("error in server");
  console.log(`server running on ${port}`);
});
