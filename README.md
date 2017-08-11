# Impactasaurus Web App

Impactasaurus is changing the way charities measure and report on social impact. We are building a free, open source, easy to use, configurable impact measure tool, which is compatible with any CRM. Read more about Impactasaurus at https://impactasaurus.org.

The web app is written using typescript, react, apollo and semantic UI.

## Getting Started

Currently impactasaurus is an invite only application. To get access please email admin@impactasaurus.org or visit our [gitter chat room](https://gitter.im/impactasaurus) and ask for an invite.

To run the application against the live backend, simply:
```
npm install && npm start
```
Then navigate to http://localhost:8080. You should be able to log in and use the application exactly as it appears on the live site.

## Running a Local Backend

If you want to try out changes using a local server and database you need to host the server locally and then connect the frontend to it.

First spin up the server project, details for how to do this can be found in the [server project](https://github.com/impactasaurus/server).

Then edit `config/main.js`, changing `config.app.api` to point at `http://localhost:8081/v1/graphql` instead of the live API.

## Contributing

Please read the [contribution guidelines](https://github.com/impactasaurus/server/blob/master/CONTRIBUTING.md) to find out how to contribute.
