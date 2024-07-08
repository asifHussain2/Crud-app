const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Student = require('./models/Student');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb+srv://asif2468:Hussaink17861@cluster0.vi18a4b.mongodb.net/StudentManagement?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));



// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Register endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).send('Student already registered');
    }

    const student = new Student({ name, email, password });
    await student.save();

  
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
  } catch (err) {
    console.error('Error registering student:', err);
    res.status(500).send('Error registering student.');
  }
});

// Endpoint to fetch current student details
app.get('/student/current', async (req, res) => {
    const { email } = req.query; // Retrieve email from query parameter
  
    try {
      const student = await Student.findOne({ email });
      
      if (student) {
        res.json(student); // Return JSON response with student details
      } else {
        res.status(404).send('Student not found');
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
      res.status(500).send('Error fetching student details');
    }
  });
  
// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const student = await Student.findOne({ email, password });
    
    if (student) {
      res.sendFile(path.join(__dirname, 'views', 'student-details.html'));
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send('Error logging in');
  }
});

// Endpoint to fetch student details (for demonstration purposes)
app.get('/student/:id', async (req, res) => {
  const studentId = req.params.id;
  
  try {
    const student = await Student.findById(studentId);
    
    if (student) {
      res.json(student);
    } else {
      res.status(404).send('Student not found');
    }
  } catch (err) {
    console.error('Error fetching student details:', err);
    res.status(500).send('Error fetching student details');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
