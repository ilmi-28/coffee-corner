const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files (HTML, CSS, JS)

// Connect to SQLite database (or create it if it doesn’t exist)
const db = new sqlite3.Database("./contacts.db", (err) => {
    if (err) return console.error(err.message);
    console.log("Connected to SQLite database.");
});

// Create the contact_messages table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT
    )
`);

// Route to handle form submission
app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;
    db.run(
        `INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)`,
        [name, email, message],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send("Failed to save message.");
            }
            res.send("Message received! Thank you for contacting us.");
        }
    );
});

app.get("/messages", (req, res) => {
    db.all("SELECT * FROM contact_messages", [], (err, rows) => {
        if (err) {
            return res.status(500).send("Error retrieving messages");
        }
        res.json(rows);
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
