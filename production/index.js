var express = require("express");
var app = express();

app.use(express.static("dist")).listen(3000, () => {
  console.log('running:  http://localhost:3000')
});