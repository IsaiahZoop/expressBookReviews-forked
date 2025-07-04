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

const axios = require('axios');

// Async version using Axios and Promises
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        // Simulate async book fetch
        resolve(books);
      });
    };

    const bookList = await getBooks();
    res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching book list." });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const getBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject("Book not found");
          }
        });
      };
  
      const book = await getBookByISBN(isbn);
      res.status(200).json(book);
    } catch (err) {
      res.status(404).json({ message: err });
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(
          (book) => book.author.toLowerCase() === author.toLowerCase()
        );

        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject("No books found for the given author.");
        }
      });
    };

    const result = await getBooksByAuthor(author);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(
          (book) => book.title.toLowerCase() === title.toLowerCase()
        );

        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject("No books found for the given title.");
        }
      });
    };

    const result = await getBooksByTitle(title);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err });
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
