const http = require("http");
const mongo = require("mongoose");
const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://duckycoyote:newpassword@clusters.v7tritj.mongodb.net/?retryWrites=true&w=majority";

mongo.connection.on("open", () => {
  console.log("MongoDb connection ready!");
});

mongo.connection.on("error", (err) => {
  console.log(err);
});

async function startServer() {
  await mongo.connect(MONGO_URL, {});
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log("Listening on: ", PORT, "...");
  });
}

startServer();
