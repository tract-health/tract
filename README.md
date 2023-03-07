# TRACT

Point of Care Tool

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- Authentication is provided with Firebase
- Node.js for running locally

### Environmental Variables

This project requires Firebase authentication credentials provided in .env file. The variables needed are:

```
REACT_APP_FIREBASE_APIKEY
REACT_APP_FIREBASE_AUTHDOMAIN
REACT_APP_FIREBASE_DATABASEURL
REACT_APP_FIREBASE_PROJECTID
REACT_APP_FIREBASE_STORAGEBUCKET
REACT_APP_FIREBASE_MESSAGINGSENDERID
REACT_APP_FIREBASE_APPID
REACT_APP_FIREBASE_MEASUREMENTID
```

### TRACT Factors

TRACT factors, questions and definitions can be adjusted in `data\survey.detail.json` file before building the application.

### Installing

A step by step series of examples that tell you how to get a development env running

Install Node.js packages

```
npm install
```

Run application in development mode

```
npm run dev
```

## Deployment

For deployment you need some Http Server (nginx, apache, ...)

## Built With

* Node.js

```
npm run build
```
