const { MongoClient } = require("mongodb");

describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    try {
      console.log(
        "TEST CASE DB: ",
        `mongodb+srv://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_INITDB_DATABASE}?retryWrites=true&w=majority`
      );
      connection = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_INITDB_DATABASE}?retryWrites=true&w=majority`,
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
  }, 60000);

  afterAll(async () => {
    if (connection) {
      await connection.close();
    }
  }, 60000);

  it("should insert a doc into collection", async () => {
    console.log(
      "INNER TEST CASE DB: ",
      `mongodb+srv://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_INITDB_DATABASE}?retryWrites=true&w=majority`
    );
    const users = db.collection(process.env.MONGO_INITDB_DATABASE);

    await users.drop();

    const mockUser = { _id: "some-user-id", name: "John" };
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({ _id: "some-user-id" });
    expect(insertedUser).toEqual(mockUser);
  }, 60000);
});
