const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if username already exists
  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists." });
  }

  // Add new user to users array
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: `Book not found for ISBN ${isbn}` });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const requestedAuthor = req.params.author.toLowerCase();
  let matchingBooks = [];

  for (let key of Object.keys(books)) {
    const book = books[key];
    if (book.author.toLowerCase() === requestedAuthor) {
      matchingBooks.push(book);
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: `No books found by author: ${req.params.author}` });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const requestedTitle = req.params.title.toLowerCase();
  let matchingBooks = [];

  for (let key of Object.keys(books)) {
    const book = books[key];
    if (book.title.toLowerCase() === requestedTitle) {
      matchingBooks.push(book);
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: `No books found with title: ${req.params.title}` });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: `No book found for ISBN ${isbn}` });
  }
});

module.exports.general = public_users;
