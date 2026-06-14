import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
(async () => {
  try {
    console.log('Using URI:', uri);
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Mongo test: connected');
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error('Mongo test: error');
    console.error(err);
    process.exit(1);
  }
})();
