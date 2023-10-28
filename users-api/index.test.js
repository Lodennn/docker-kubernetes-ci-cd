const { MongoClient } = require("mongodb");

describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    try {
      console.log(
        "DATABASE MONGO URI: ",
        `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_DB_HOST}:27017/${process.env.MONGO_INITDB_DATABASE}?authSource=admin`
      );
      //   connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
      connection = await MongoClient.connect(
        `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_DB_HOST}:27017/${process.env.MONGO_INITDB_DATABASE}?authSource=admin`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      db = await connection.db(process.env.MONGO_INITDB_DATABASE);
      console.log("*#* CONNECTED TO DATABASE *#*");
    } catch (err) {
      console.log("*#* FAILED CONNECTION TO DATABASE *#*");
    }
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should insert a doc into collection", async () => {
    const users = db.collection("users");

    const mockUser = { _id: "some-user-id", name: "John" };
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({ _id: "some-user-id" });
    expect(insertedUser).toEqual(mockUser);
  });
});
