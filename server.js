const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
// const cors = require("cors");

const markdown = require("./routes/api/markdown");

const app = express();

const path = require("path");

let global = require('./common/global');

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

let clientMode;
let PORT = process.env.PORT || 8081;

if (process.argv[2] === 'backoffice') {
  PORT = 8081;
  clientMode = 'dist-bo';

  // Set API routes
  app.use('/api/markdown', markdown);
  app.use('/markdowns', express.static(`markdowns`));
} else {
  PORT = 8082;
  clientMode = 'dist-public';
}

// Set static folder
app.use(express.static(`client/${clientMode}`));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', clientMode, 'index.html'));
});

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});