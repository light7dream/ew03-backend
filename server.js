const express = require("express");
const cors = require("cors");
const path = require('path');

const app = express();

require('dotenv').config();

// parse requests of content-type - application/json
app.use(express.json()); 
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

// set static folder - shared folder
app.use(express.static(path.join(__dirname, 'public'))); 

// routes
require('./app/routes')(app);
// database connection
require('./app/config/db.config')()

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome!" });
});
  
