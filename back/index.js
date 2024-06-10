const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');

const app = express();
app.use(cors());

var client = mqtt.connect('mqtt://localhost:1883');
let data = [];

client.on('connect', function () {
  console.log('Connected to MQTT broker');
  client.subscribe('sensor/readings', function (err) {
    if (!err) {
      console.log('Subscribed to topic: sensor/readings');
    } else {
      console.error('Failed to subscribe: ', err);
    }
  });
});

client.on('message', function (topic, message) {
  // message is Buffer, we need to convert it to json
  try {
    
    const jsonData = JSON.parse(message.toString());
    console.log(jsonData);
    data.push(jsonData);
  } catch (e) {
    console.error('Failed to parse message: ', e);
  }
});

app.get('/data', (req, res) => {
  res.send(data);
});

app.listen(3001, () => {
  console.log('Server is listening on port 3001!');
});
