const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Setup (SQLite)
const db = new sqlite3.Database('./orders.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        // Create Orders Table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT,
            phone TEXT,
            country TEXT,
            address TEXT,
            items TEXT,
            total_price INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Route 1: Naya Order Receive Karne Ke Liye (POST)
app.post('/api/orders', (req, res) => {
    const { name, phone, country, address, items, totalPrice } = req.body;

    if (!name || !phone || !address || !items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'براہ کرم تمام معلومات فراہم کریں۔' });
    }

    const itemsJson = JSON.stringify(items);
    const sql = `INSERT INTO orders (customer_name, phone, country, address, items, total_price) VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(sql, [name, phone, country, address, itemsJson, totalPrice], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'آرڈر محفوظ نہیں ہو سکا۔' });
        }
        res.json({
            success: true,
            message: 'آرڈر کامیابی سے موصول ہو گیا ہے!',
            orderId: this.lastID
        });
    });
});

// Route 2: Tamam Orders Dekhne Ke Liye (GET - Admin View)
app.get('/api/orders', (req, res) => {
    const sql = `SELECT * FROM orders ORDER BY created_at DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        const formattedRows = rows.map(row => ({
            ...row,
            items: JSON.parse(row.items)
        }));
        res.json({ success: true, orders: formattedRows });
    });
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});