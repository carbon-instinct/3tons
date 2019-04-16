// SETUP

console.log("Server is online");

const express = require("express");
const { WebhookClient } = require("dialogflow-fulfillment");
const app = express();

app.get("/", (req, res) => res.send("online"));
app.post("/dialogflow", express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  var coClearDatabase = require("./databases/CoClear.json");

  // REPLY FUNCTIONS FOR INTENTS

  function welcome() {
    agent.add("Welcome Vincent the first to activate webhook !");
  }
  function fallback(agent) {
    agent.add(`I didn't understand sir 42`);
    agent.add(`I'm sorry, can you try again sir?`);
  }

  function testCity(agent) {
    let country = coClearDatabase.data[0].country;
    const city = agent.parameters["geo-city"];
    agent.add(`Let's talk about ${city} in  ${country}`);
  }

  function testProducts(agent) {
    const product = agent.parameters["products"];
    let result = coClearDatabase.data.filter(e => {
      if (e.name == product) {
        console.log(e.name);
        return true;
      } else return false;
    });

    let co2 = result[0].footprint;

    agent.add(`The co2 of ${product} is ${co2} kg`);

    // INFORMATION ON THE RELATIVE IMPORTANCE REGARDING THE YEARLY/MONTHLY/DAILY BUDGET IN CO2

    let totalAnnual = 3000;
    let totalMonthly = totalAnnual / 12;
    let totalDaily = totalAnnual / 365;

    let percentAnnual = Math.round((co2 / totalAnnual) * 100);
    let percentMonthly = Math.round((co2 / totalMonthly) * 100);
    let percentDaily = Math.round((co2 / totalDaily) * 100);

    percentAnnual > 1
      ? agent.add(
          `The co2 of ${product} is ${percentAnnual} % of your yearly co2 budget`
        )
      : percentMonthly > 1
      ? agent.add(
          `The co2 of ${product} is ${percentMonthly} % of your monthly co2 budget`
        )
      : agent.add(
          `The co2 of ${product} is ${percentDaily} % of your daily co2 budget`
        );
  }

  // MAPPING
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("testCity", testCity);
  intentMap.set("testProducts", testProducts);

  // END
  agent.handleRequest(intentMap);
});

app.listen(process.env.PORT || 8080);
