// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the app
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for cross-origin requests

// MongoDB connection
const mongoURI = "mongodb+srv://rudranilhalder2003:<db_password>@cluster0.cnduk.mongodb.net/";  // Replace with your MongoDB Atlas URI if using cloud DB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Define Schemas
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const BookSchema = new mongoose.Schema({
    bookName: String,
    authorName: String,
    issueDate: Date,
    returnDate: Date,
    remarks: String
});

const MembershipSchema = new mongoose.Schema({
    membershipName: String,
    membershipDuration: String
});

// Models
const User = mongoose.model('User', UserSchema);
const Book = mongoose.model('Book', BookSchema);
const Membership = mongoose.model('Membership', MembershipSchema);

// Routes

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Issue Book Route
app.post('/issue-book', async (req, res) => {
    const { bookName, authorName, issueDate, returnDate, remarks } = req.body;
    const book = new Book({ bookName, authorName, issueDate, returnDate, remarks });
    await book.save();
    res.status(201).json({ message: 'Book issued successfully' });
});

// Return Book Route
app.post('/return-book', async (req, res) => {
    const { bookName, serialNo } = req.body;
    const book = await Book.findOne({ bookName, serialNo });
    if (book) {
        // Assuming return book logic happens here
        res.status(200).json({ message: 'Book returned successfully' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// Add Membership Route
app.post('/add-membership', async (req, res) => {
    const { membershipName, membershipDuration } = req.body;
    const membership = new Membership({ membershipName, membershipDuration });
    await membership.save();
    res.status(201).json({ message: 'Membership added successfully' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));