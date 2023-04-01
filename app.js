const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const cors = require('cors');
const routerApp = require('./crud');
const authApp = require('./server');
const { mongoConnect } = require('./databaseConnector');

app.use(cors({
    origin: '*'
}))
app.use(bodyParser.json());
app.use(routerApp);
app.use(authApp);

mongoConnect();

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});