import { MongoClient } from 'mongodb';
const uri = 'mongodb://localhost:27017';
(async () => {
  try {
    console.log('Attempting direct connect to', uri);
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Direct Mongo test: connected');
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error('Direct Mongo test: error');
    console.error(err);
    process.exit(1);
  }
})();
