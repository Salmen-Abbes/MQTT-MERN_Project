const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'MQTT Dash',
    description: 'API doc for Mayas MQTT Dash'
  },
  host: 'localhost:3002'
};

const outputFile = './swagger.json';
const routes = ['./app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);