const express = require("express");
const app = express();
const port = process.env.PORT || 2021;
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
app.use(express.static(process.cwd() + '/fund-track'));

mongoConnect();

app.get('/', (req, res) => {
    console.log("address:", req.hostname)
    res.sendFile(process.cwd() + '/fund-track/index.html');
});

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});