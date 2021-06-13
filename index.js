const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.use(express.static("./assets"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/", require("./routes"));
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
app.listen(port, function (err) {
  if (err) console.log("error in server");
  console.log(`server running on ${port}`);
});
