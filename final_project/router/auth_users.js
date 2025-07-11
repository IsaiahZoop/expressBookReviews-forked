const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(u => u.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const user = users.find(u => u.username === username && u.password === password);
    return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT token
    const accessToken = jwt.sign(
      { username },
      'access', // Secret key
      { expiresIn: '1h' }
    );

    // Save token in session
    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({ message: "Login successful!" });
  } else {
    return res.status(401).json({ message: "Invalid credentials." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required as a query parameter." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }

  // Add or update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully." });
});

// Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }

  const userReview = books[isbn].reviews[username];

  if (!userReview) {
    return res.status(404).json({ message: "You have not posted a review for this book." });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Your review has been deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
