// Import required modules
const express = require('express');
//const bodyParser = require('body-parser');
const db = require('./config/db');
require('dotenv').config()


// Import routes
const authRoutes = require('./routes/authRoutes'); // Include authentication routes
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Connect to MySQL database
db.authenticate()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Error connecting to the database:', err));

// Set up body parser middleware
//app.use(bodyParser.json());
//app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Define routes
app.use('/auth', authRoutes); // Mount authentication routes
app.use('/users', userRoutes);
app.use('/blogs', blogRoutes);

// Define a route for the home page
app.get('/', (req, res) => {
  res.render('home');
});

// Define a route for the login page
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req,res)=>{
  res.render('register');
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
