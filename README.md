# Event_Logging_System

# Event Logging System

## Overview
A scalable backend system to log, store, and retrieve tamper-proof event logs for distributed applications.

## Features
- **Event Logging API**: RESTful endpoints to log and retrieve events.
- **Tamper-Proof Design**: Events are linked using cryptographic hashes.
- **Querying**: Filter logs by type, date range, and source application.
- **Real-Time Streaming**: SSE for live updates.
- **Scalability**: Uses MongoDB for robust storage.

## Prerequisites
- Node.js
- MongoDB


##API Endpoints
###Log Event
  POST /api/event-logs
  body
    {
  "eventType": "INFO",
  "timestamp": "2024-11-21T12:00:00Z",
  "sourceAppId": "App123",
  "data": { "key": "value" }
}

Response:

  {
  "message": "Event logged successfully",
  "logId": "645b2dc3b2f5d3e8a8c9d8b3"
}

###Query Events
GET /api/event-logs

Query Parameters:
page, limit, eventType, startDate, endDate

Response
  {
  "logs": [...],
  "page": 1,
  "limit": 10
}

## use postman to chech all the end ponts 
you have to add data in header add contect-type and value-application-json
then select post then go to body tab and select raw and add this type of data
" {
  "eventType": "self login",
  "timestamp": "2024-11-21T13:49:14.467+05:30",  // Example timestamp (ISO 8601 format)
  "sourceAppId": "app123",
  "data": {
    "userId": "use888",
    "sessionId": "abcd1277"
  }
}
"


## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/TusharRaval/Event-Logging-System.git
   cd Event-Logging-System

   ##Install dependencies:
   npm install

   ##Start MongoDB.
    mongod

   ##Run the server:
   node server.js

   
