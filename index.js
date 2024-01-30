const express = require("express");
const bodyParser = require("body-parser");
const xss = require('xss');
const _ = require('lodash');
const usersRouter = require("./Router/Users");
const fileUpload = require('express-fileupload');

const app = express();

const server = require('http').Server(app);


app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use((req, res, next) => {
  if (Object.keys(req.body).length > 0) {
    for (let index in req.body) {
      if (_.isString(req.body[index])) {
        req.body[index] = req.body[index].trim();
        req.body[index] = xss(req.body[index]);
      }
    }
    next();
  } else {
    next();
  }
});
app.use(fileUpload())
app.use("/api/users", usersRouter);
app.use("/api/projects", require("./Router/Projects"));

server.listen(4500, function () {
  console.debug(`listening on port 4500`);
});