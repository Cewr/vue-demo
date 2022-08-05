var express = require("express");
var app = express();

app.use(express.static("dist")).listen(8888, () => {
  console.log('running:  http://localhost:8888')
});