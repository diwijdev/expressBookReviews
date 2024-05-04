const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(books.hasOwnProperty(isbn)){
    return res.status(200).json(books[isbn]);
  }
  else{
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let author = req.params.author; // Extract author from route parameters
  
    // Initialize an array to store filtered books
    let filteredBooks = [];
  
    // Iterate through the keys of the books object
    for (let key in books) {
      if (books.hasOwnProperty(key)) {
        let book = books[key];
        // Check if the author of the current book matches the provided author
        if (book.author.toLowerCase() === author.toLowerCase()) {
          // If the author matches, add the book to the filtered books array
          filteredBooks.push(book);
        }
      }
    }
  
    // Return the filtered books
    return res.status(200).json(filteredBooks);
});
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title; // Extract author from route parameters
  
    // Initialize an array to store filtered books
    let filteredBooks = [];
  
    // Iterate through the keys of the books object
    for (let key in books) {
      if (books.hasOwnProperty(key)) {
        let book = books[key];
        // Check if the author of the current book matches the provided author
        if (book.title.toLowerCase() === title.toLowerCase()) {
          // If the author matches, add the book to the filtered books array
          filteredBooks.push(book);
        }
      }
    }
  
    // Return the filtered books
    return res.status(200).json(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    if(books.hasOwnProperty(isbn)){
      return res.status(200).json(books[isbn].reviews);
    }
    else{
      return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
