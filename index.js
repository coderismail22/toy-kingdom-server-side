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
    // Get Operations
    app.get("/mathtoys", async (req, res) => {
      const cursor = mathToys.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/sciencetoys", async (req, res) => {
      const cursor = scienceToys.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/engineeringtoys", async (req, res) => {
      const cursor = engineeringToys.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Find one toy

    app.get("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: {
          photo: 1,
          name: 1,
          seller: 1,
          sellerMail: 1,
          price: 1,
          rating: 1,
          quantity: 1,
          description: 1,
        },
      };

      let toy;

      toy = await mathToys.findOne(query, options);
      if (!toy) {
        toy = await scienceToys.findOne(query, options);
      }
      if (!toy) {
        toy = await userAdded.findOne(query, options);
      }
      if (!toy) {
        toy = await engineeringToys.findOne(query, options);
      }

      res.send(toy);
    });

    // Add a toy
    app.post("/addatoy", async (req, res) => {
      const toy = req.body;
      console.log(toy);
      const result = await userAdded.insertOne(toy);
      res.send(result);
    });

    // Get My Toys
    app.get("/addatoy", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await userAdded.find(query).toArray();
      res.send(result);
    });

    // Get All Toy of All Users
    const mathToysData = await mathToys.find().toArray();
    const scienceToysData = await scienceToys.find().toArray();
    const engineeringToysData = await engineeringToys.find().toArray();
    const userAddedData = await userAdded.find().toArray();
    const allToys = [
      ...mathToysData,
      ...scienceToysData,
      ...engineeringToysData,
      ...userAddedData,
    ];

    app.get("/alltoys", async (req, res) => {
      res.send(allToys);
    });

    // UPDATE A TOY
    app.patch("/addatoy", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateToy = req.body;
      console.log(updateToy);
      const updateDoc = {
        $set: {
          status: updateToy.status,
        },
      };
      const result = await userAdded.updateOne(filter, updateDoc);
      res.send(result);
    });

    // DELETE A TOY
    app.delete("/toy/:id", async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      let result;

      // Check if the toy exists
      const mathToy = await mathToys.findOne(query);
      if (mathToy) {
        result = await mathToys.deleteOne(query);
      } else {
        const scienceToy = await scienceToys.findOne(query);
        if (scienceToy) {
          result = await scienceToys.deleteOne(query);
        } else {
          const engineeringToy = await engineeringToys.findOne(query);
          if (engineeringToy) {
            result = await engineeringToys.deleteOne(query);
          } else {
            const userAddedToy = await userAdded.findOne(query);
            if (userAddedToy) {
              result = await userAdded.deleteOne(query);
            } else {
              // Toy not found
              return res.status(404).send("Toy not found.");
            }
          }
        }
      }

      if (result.deletedCount > 0) {
        res.send({ deletedCount: result.deletedCount });
      } else {
        res.status(404).send("Toy not found.");
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
//

app.get("/", (req, res) => {
  res.send("Toy Kindom is running");
});

app.listen(port, () => {
  console.log(`Toy Kingdom Server is running on port ${port}`);
});
