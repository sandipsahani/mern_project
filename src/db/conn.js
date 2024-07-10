const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/employeeRegistration", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("connection is successful");
  })
  .catch((e) => {
    console.log("no connection");
  });
