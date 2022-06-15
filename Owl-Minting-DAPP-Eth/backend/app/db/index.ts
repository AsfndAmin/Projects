const mongoose = require("mongoose");
require('dotenv').config(); 
const {environment}= require("../../environment")


let connectDB = async () =>
{ 
  try
  {
    const conn = await mongoose.connect(
        environment.MONGOOSE_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      { useCreateIndex: true }
    );
    console.log(`Mongoose Connected ${conn.connection.host}`);
  } catch (error:any) 
  {
    console.error(`Error:${error.message}`);
    process.exit(1);
  }
};  

export { connectDB }

