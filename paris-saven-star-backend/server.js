 // server.js - Seven Star Backend Server
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Temporary Database Array
let ordersList = [];

// 1. Order Receive API Route
app.post('/api/orders', (req, res) => {
    const newOrder = {
        id: "SS-" + Math.floor(1000 + Math.random() * 9000),
        customerName: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        product: req.body.product,
        price: req.body.price,
        paymentMethod: req.body.paymentMethod,
        region: req.body.region,
        date: new Date().toLocaleString()
    };

    ordersList.push(newOrder);
    console.log("New Order Received: ", newOrder);

    res.status(201).json({ 
        success: true, 
        message: "Order placed successfully!", 
        orderId: newOrder.id 
    });
});

// 2. Admin Panel Orders View API Route
app.get('/api/admin/orders', (req, res) => {
    res.json({
        success: true,
        totalOrders: ordersList.length,
        orders: ordersList
    });
});

// Server Start
app.listen(PORT, () => {
    console.log(`Seven Star Backend Server is running on http://localhost:${PORT}`);
});