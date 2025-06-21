const mongodb = require('mongodb');
require('dotenv').config();

const client = new mongodb.MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const database = client.db('Smart_Bell');

    return {
      User: database.collection("Authentication"),
      InvestorRegister: database.collection("InvestorRegister"),
      ClientRegister: database.collection("ClientRegister"),
      UserType: database.collection("UserType")
    };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = connectToDatabase;
