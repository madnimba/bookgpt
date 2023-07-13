const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const bodyParser = require('body-parser');

app.get('/', (req, res) => {
    res.send("Hello World");
    }   
);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    }
);

