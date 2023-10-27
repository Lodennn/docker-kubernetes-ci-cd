const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user-routes");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(userRoutes);

app.use((err, req, res, next) => {
  let code = 500;
  let message = "Something went wrong.";
  if (err.code) {
    code = err.code;
  }

  if (err.message) {
    message = err.message;
  }
  res.status(code).json({ message: message });
});

const delay = (miliseconds) =>
  new Promise((res) => setTimeout(res, miliseconds));

delay(7000)
  .then((_) => {
    mongoose.connect(
      `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_DB_HOST}:27017/${process.env.MONGO_INITDB_DATABASE}?authSource=admin`,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (err) {
          console.log("ERROR: ", err);
          console.log("COULD NOT CONNECT TO MONGODB%%%%%%%%%%%%");
          console.log(
            `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_DB_HOST}:27017/${process.env.MONGO_INITDB_DATABASE}`
          );
        } else {
          console.log("DATABASE CONNECTED SUCCESSFULLY");
          console.log(
            `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_DB_HOST}:27017/${process.env.MONGO_INITDB_DATABASE}`
          );
          app.listen(3000);
        }
      }
    );
  })
  .catch((err) => {
    console.log("DATABASE NOT CONNECTED");
  });
