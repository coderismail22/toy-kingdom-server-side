const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware configuration:
app.use(cors());
app.use(express.json());

//

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.VITE_USERNAME}:${process.env.VITE_USERPASS}@cluster0.4in3v8j.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
  
      const mathToys = client.db("toykingdom").collection("mathtoys");
      const scienceToys = client.db("toykingdom").collection("sciencetoys");
      const engineeringToys = client
        .db("toykingdom")
        .collection("engineeringtoys");
      const userAdded = client.db("toykingdom").collection("usertoys");
  


