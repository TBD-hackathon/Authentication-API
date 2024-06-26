const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, '../Data/data.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../View')));

// Helper functions to read and write data from/to JSON file
const readDataFromFile = () => {
    try {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeDataToFile = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Routes

// Root route (no longer needed as index.html is served as a static file)
// app.get('/', (req, res) => {
//     res.send('Welcome to the REST API');
// });

// Create (POST)
app.post('/items', (req, res) => {
    const items = readDataFromFile();
    const item = req.body;
    item.id = items.length + 1;
    items.push(item);
    writeDataToFile(items);
    res.status(201).json(item);
});

// Read (GET)
app.get('/items', (req, res) => {
    const items = readDataFromFile();
    res.json(items);
});

// Update (PUT)
app.put('/items/:id', (req, res) => {
    const items = readDataFromFile();
    const id = parseInt(req.params.id);
    const updatedItem = req.body;
    let item = items.find(i => i.id === id);
    if (item) {
        Object.assign(item, updatedItem);
        writeDataToFile(items);
        res.json(item);
    } else {
        res.status(404).json({ message: "Item not found" });
    }
});

// Delete (DELETE)
app.delete('/items/:id', (req, res) => {
    const items = readDataFromFile();
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(i => i.id === id);
    if (itemIndex !== -1) {
        items.splice(itemIndex, 1);
        writeDataToFile(items);
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Item not found" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
