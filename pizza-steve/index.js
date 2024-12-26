const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user.model');
const Order = require('./models/order.model');  // Order model
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// MongoDB
mongoose.connect('mongodb://localhost:27017/pizza', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));



// Create new user
app.post('/api/user', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    //  return user data
    res.json({
      userId: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      address: user.address,
      city: user.city,
      state: user.state,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save order
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, method, size, crust, quantity, toppings, price } = req.body;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    // Create new order
    const order = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      method,
      size,
      crust,
      quantity,
      toppings,
      price,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get orders by userId
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    // Fetch orders for the user
    const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch user details by userId
app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      address: user.address,
      city: user.city,
      state: user.state,
      password: user.password,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
