const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce").then(() => {
    console.log("Connected to MongoDB");
  }).catch((err) => {
    console.error(err);
  });



const db = mongoose.connection;

db.on("connected", () => {
    console.log("mongodb has been connected");
});

db.on('error', () => {
    console.log("some error has occurred");
});

db.on('disconnected', () => {
    console.log("disconnected from mongodb");
});

export default db; // Use ES module export
