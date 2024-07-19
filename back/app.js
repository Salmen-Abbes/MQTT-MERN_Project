const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const authRouter = require('./routers/authRouter');
const adminRouter = require('./routers/adminRouter');
const dataRouter = require('./routers/dataRouter');
const { addData } = require('./controllers/dataController');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());

var client = mqtt.connect('mqtt://localhost:1883');
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
  try {
    const jsonData = JSON.parse(message.toString());
    console.log(jsonData);
    addData(jsonData);
  } catch (e) {
    console.error('Failed to parse message: ', e);
  }
});

app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/data', dataRouter);
app.post('/test',(req,res)=>{
    
})
module.exports = app;
