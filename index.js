const express = require("express");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.use(express.static("./assets"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) console.log("error in server");
  console.log(`server running on ${port}`);
});
