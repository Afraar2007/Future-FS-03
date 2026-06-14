import mongoose from "mongoose";

const uri =
  "mongodb+srv://afraar1512007_db_user:NGt1KhDh70d1QaWU@cluster0.gifce4y.mongodb.net/?appName=Cluster0";

const clientOptions = {
  serverApi: { version: "1" as const, strict: true, deprecationErrors: true },
};

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}

run().catch(console.dir);