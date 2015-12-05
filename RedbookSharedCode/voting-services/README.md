# API Server Swagger project

This node.js swagger project was created to support the API Server application used in Hybrid Cloud redbook.

This project provides API for the following functions :

1. Create /Update /Delete /List data into MySQL database. 
2. Create a message using MQ Light API on local MQ Light/ MQ Light on IBM Bluemix / IBM MQ 8.0.0.4
3. Listens to topics using  MQ Light API on local MQ Light/ MQ Light on IBM Bluemix / IBM MQ 8.0.0.4 . Latest data received is cached. Cached message is returned when API is called. 
4. Proxy service for recording a vote. The proxy service can use API in step 1 or API in step 2 to persist data received. 

The project has a number of properties that allow the application to connect to MQ Light/ database servers etc. Details of parameters in coming IBM redbook. 

This project also contains a console to test the Swagger API. 
The console can be used to test the Swagger API. 