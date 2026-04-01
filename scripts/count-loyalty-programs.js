const { MongoClient } = require("mongodb");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://vahu_readonly:Pu0m0bsNaH1WQJbS94JE@50.116.45.107:27017/bloy";

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const db = client.db("bloy");
  const count = await db.collection("loyaltyprograms").countDocuments({});

  console.log(JSON.stringify({ count }, null, 2));

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

