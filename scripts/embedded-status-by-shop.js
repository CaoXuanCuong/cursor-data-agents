const { MongoClient } = require("mongodb");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://vahu_readonly:Pu0m0bsNaH1WQJbS94JE@50.116.45.107:27017/bloy";

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const db = client.db("bloy");

  const pages = ["product", "post_purchase", "cart"];
  const pipeline = [
    { $match: { showOnPage: { $in: pages } } },
    {
      $addFields: {
        updatedAtD: { $toDate: "$updatedAt" },
        createdAtD: { $toDate: "$createdAt" }
      }
    },
    { $sort: { shop: 1, showOnPage: 1, updatedAtD: -1, createdAtD: -1 } },
    {
      $group: {
        _id: { shop: "$shop", showOnPage: "$showOnPage" },
        status: { $first: "$status" },
        updatedAt: { $first: "$updatedAt" },
        docId: { $first: "$_id" }
      }
    },
    {
      $group: {
        _id: "$_id.shop",
        pages: {
          $push: {
            k: "$_id.showOnPage",
            v: { status: "$status", updatedAt: "$updatedAt", docId: "$docId" }
          }
        }
      }
    },
    { $addFields: { pageObj: { $arrayToObject: "$pages" } } },
    {
      $lookup: {
        from: "shops",
        localField: "_id",
        foreignField: "_id",
        as: "shopDoc"
      }
    },
    { $addFields: { shopDoc: { $first: "$shopDoc" } } },
    {
      $project: {
        _id: 0,
        shopId: "$_id",
        shopifyDomain: "$shopDoc.shopifyDomain",
        shopName: "$shopDoc.shopName",
        pointsOnProductPage: "$pageObj.product.status",
        postPurchase: "$pageObj.post_purchase.status",
        redeemOnCart: "$pageObj.cart.status",
        productUpdatedAt: "$pageObj.product.updatedAt",
        postPurchaseUpdatedAt: "$pageObj.post_purchase.updatedAt",
        cartUpdatedAt: "$pageObj.cart.updatedAt"
      }
    },
    { $sort: { shopifyDomain: 1 } }
  ];

  const rows = await db
    .collection("embeddedcontents")
    .aggregate(pipeline, { allowDiskUse: true })
    .toArray();

  console.log(JSON.stringify({ count: rows.length, rows }, null, 2));

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

