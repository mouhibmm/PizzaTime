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

    // Return user data
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
      status: 'pending', // Default status is pending
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order status to 'confirmed'
app.put('/api/orders/:orderId/confirm', async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid orderId format' });
    }

    // Update the order status to 'confirmed'
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'confirmed' }, // Update status to confirmed
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Update order favorite status
app.put('/api/orders/:orderId/favorite', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { favorite } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid orderId format' });
    }

    // Find the order and update the favorite status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { favorite },  
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Fetch favorite order for a user
app.get('/api/orders/favorite/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    const favoriteOrder = await Order.findOne({ userId: new mongoose.Types.ObjectId(userId), favorite: true });

    if (!favoriteOrder) {
      return res.status(404).json({ message: 'No favorite order found for this user' });
    }

    res.json(favoriteOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get orders by userId
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }
    const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/orders/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
   
    const result = await Order.deleteOne({ _id: orderId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting the order:', error);
    res.status(500).json({ message: 'Failed to delete the order' });
  }
});


// Fetch confirmed orders for a user
app.get('/api/orders/confirmed/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    // Fetch confirmed orders for the given userId
    const orders = await Order.find({ userId, status: 'confirmed' });

    if (!orders.length) {
      return res.status(404).json({ message: 'No confirmed orders found for this user' });
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
