console.log("test");

const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')

const app = express()

app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

  function welcome () {
    agent.add('Welcome Vincent the first to activate webhook !')
  }
  function fallback(agent) {
    agent.add(`I didn't understand sir 42`);
    agent.add(`I'm sorry, can you try again sir?`);
  }

  

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT || 8080)