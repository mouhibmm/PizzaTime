const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user.model.js');
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/pizza', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Basic route
app.get('/', (req, res) => {
  res.send("Hello from Node");
});

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

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


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
          adress: user.adress,
          city: user.city,
          state: user.state,
          password: user.password, // Optional, depending on security needs
        });
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
    });

    // If the credentials match, send back the user data (including the ID)
    res.json({
      userId: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      adress: user.adress,
      city: user.city,
      state: user.state,
      // Include other data you need
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
