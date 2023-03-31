const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Declare express app
const app = express();

/* APP USE DEPENDENCIES*/
app.use(express.json());
app.use(cors());

// Homepage GET route
app.get('/', (req, res) => {
    res.status(200).json("Hospital App Backend!");
});


// Run backend on port 5000
const PORT = 5000;
app.listen(5000, ()=>{
    console.log(`Server running on port ${PORT}. `);
});