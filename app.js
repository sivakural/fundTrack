const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const { port } = require('./config');
const routerApp = require('./crud');
const authApp = require('./server');
const { mongoConnect } = require('./databaseConnector');
const loanapp = require('./loans/router.js');

app.use(cors({
    origin: '*'
}))
app.use(bodyParser.json());
app.use(routerApp);
app.use(authApp);
app.use(loanapp);

mongoConnect();

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});