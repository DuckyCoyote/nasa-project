const path = require("path");
const { parse } = require("csv-parse");
const fs = require("fs");

const planets = require("./planets.mongo.js");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv"),
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        }),
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          // TODO: Replace below create with insert + update = upsert
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const countHabitablePlanets = (await getAllPlanets()).length;
        console.log(`${countHabitablePlanets} habitable planets found!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  const allPlanets = await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    },
  );
  //console.log(allPlanets);
  return allPlanets;
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      },
    );
  } catch (error) {
    console.log("Coult not save planet", error);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
