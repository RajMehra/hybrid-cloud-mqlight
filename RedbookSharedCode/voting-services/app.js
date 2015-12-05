'use strict';

var SwaggerExpress = require('swagger-express-mw');
var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var util = require('util');

//parse application/json 
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
})
app.options('/*', function(req, res){
    res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
    res.send(200);
});

// Serve up Swagger UI for API documentation
app.use('/api-docs', express.static('./views/swagger-ui'));
app.use('/swagger-docs', express.static('./api/swagger'));


module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};


SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
 
  var host = process.env.VCAP_APP_HOST || 'localhost';
  var port = process.env.VCAP_APP_PORT || 10010;

  
 // var port = process.env.PORT || 10010;
  app.listen(port);
 
  console.log('try this on browser\n http://' + host + ':' + port + '/api-docs/#');
  console.log('try this:\ncurl http://' + host + ':' + port + '/v1/vote');
});
