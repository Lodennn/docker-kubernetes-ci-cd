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

console.log(
  `mongodb+srv://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_INITDB_DATABASE}?retryWrites=true&w=majority`
);

delay(5000)
  .then((_) => {
    mongoose.connect(
      `mongodb+srv://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_INITDB_DATABASE}?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (err) {
          console.log("COULD NOT CONNECT TO MONGODB: ", err);
        } else {
          console.log("DATABASE CONNECTED SUCCESSFULLY");
          app.listen(80);
        }
      }
    );
  })
  .catch((err) => {
    console.log("DATABASE NOT CONNECTED");
  });

// async function connect() {
//   mongoose.connect(
//     `mongodb+srv://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_INITDB_DATABASE}?retryWrites=true&w=majority`,
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     (err) => {
//       if (err) {
//         console.log("COULD NOT CONNECT TO MONGODB: ", err);
//         connect();
//       } else {
//         console.log("DATABASE CONNECTED SUCCESSFULLY");
//         app.listen(80);
//       }
//     }
//   );
// }

// connect();
