const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const fs = require('fs');

const app = express();
app.use(cors());

var client = mqtt.connect('mqtt://localhost:1883');
let data = [];

// Function to save data to data.json
function saveDataToFile() {
  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Data successfully saved to data.json');
    }
  });
}

client.on('connect', function () {
  console.log('Connected to MQTT broker');
  client.subscribe('sensor/readings', function (err) {
    if (!err) {
      console.log('Subscribed to topic: sensor/readings');
    } else {
      console.error('Failed to subscribe:', err);
    }
  });
});

client.on('message', function (topic, message) {
  // message is Buffer, we need to convert it to json
  try {
    const jsonData = JSON.parse(message.toString());
    console.log(jsonData);
    data.push(jsonData);
    saveDataToFile(); // Save data to file whenever new data is received
  } catch (e) {
    console.error('Failed to parse message:', e);
  }
});

app.get('/data', (req, res) => { //http://localhost:3001/data , type mta3 request : get
  res.send(data);
});

app.listen(3001, () => {
  console.log('Server is listening on port 3001!');
});
