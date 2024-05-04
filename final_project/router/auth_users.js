const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

regd_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify({users}, null, 4));
  });

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    console.log(username);
  
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.session.authorization.username;

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    if (!books.hasOwnProperty(isbn)) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Check if the user has already reviewed the book
    if (books[isbn].reviews.hasOwnProperty(username)) {
        // If the user has already reviewed, modify the existing review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review modified successfully" });
    } else {
        // If the user hasn't reviewed, add a new review
        books[isbn].reviews[username] = review;
        return res.status(201).json({ message: "Review added successfully" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Extract ISBN from request parameters
    const isbn = req.params.isbn;

    // Check if the user is logged in
    if (!req.session.authorization || !req.session.authorization.username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    // Retrieve username from session data
    const username = req.session.authorization.username;

    // Filter the reviews for the specified ISBN
    if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
        // Delete the user's review
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        return res.status(404).json({ message: "Review not found" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
