var express = require("express");
var app = express();
var mongoose = require("mongoose");
var TaskList = require("./models/TaskList");
var tasks = require('./routes/app');


require('dotenv').config();

app.use(express.static("public"));
app.use(express.urlencoded({
  extended: true
}));


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0-vlysx.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch((err) => {
    console.error(`database connection error: ${err}`);
    process.exit();
  });

app.set("view engine", "ejs")
app.use('/', tasks);


module.exports = app;
