const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // const conn = await mongoose.connect(process.env.MONGODB_URI, {
    const conn = await mongoose.connect('mongodb://localhost:27017/talk-a-tive', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected to MONGO DB ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDB;
