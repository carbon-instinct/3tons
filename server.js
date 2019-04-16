// SETUP

console.log("Server is online");

const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const app = express()

app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {
const agent = new WebhookClient({ request: req, response: res })

var coClearDatabase = require('./databases/CoClear.json');




// REPLY FUNCTIONS FOR INTENTS

  function welcome () {
    agent.add('Welcome Vincent the first to activate webhook !')
  }
  function fallback(agent) {
    agent.add(`I didn't understand sir 42`);
    agent.add(`I'm sorry, can you try again sir?`);
  }

  function testCity(agent) {
    let country = coClearDatabase.data[0].country;
    const city = agent.parameters['geo-city'];
    agent.add(`Let's talk about ${city} in  ${country}`);
  }

  function testProducts(agent) {
    const product = agent.parameters['products'];
    let co2 = coClearDatabase.data.filter(e => {


        if (e.name.toLowerCase() == product)
      {
        console.log(e.name);
        return true
      }
        
    });

    console.log('co2 is '+co2.toString());
    console.log('product is '+product);


    agent.add(`The co2 of ${product} is ${co2}`);
  }



  


  // MAPPING 
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('testCity', testCity);
  intentMap.set('testProducts', testProducts);





  // END
  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT || 8080)