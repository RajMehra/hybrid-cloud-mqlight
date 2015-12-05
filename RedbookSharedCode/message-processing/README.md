# Message Processor application

This node.js project was created to support the message processor used in Hybrid Cloud redbook.

This project provides API for the following functions :


1. Listens to topics using  MQ Light API on local MQ Light/ MQ Light on IBM Bluemix / IBM MQ 8.0.0.4 . Latest data received is added to MySQL database. 
2. Allow the user to query the last record processed by the message processor.


The project has a number of properties that allow the application to connect to MQ Light/ database servers etc. Details of parameters in coming IBM redbook. 

