const fs = require("fs");
const path = require("path");
const booksPath = path.join(__dirname, "db", "books.json");

function read(req, res) {
  fs.readFile(booksPath, "utf8", (err, books) => {
    if (err) {
      console.log(err);
      res.writeHead(400);
      res.end("An error occured");
    }
    res.writeHead(200);
    res.end(books);
  });
}

function getAllBooks(req, res) {
  read(req, res);
}

function addBook(req, res) {
  let newBook = "";
  req.on("data", (chunk) => {
    newBook += chunk;
  });
  console.log(newBook);
  req.on("end", () => {
    newBook = JSON.parse(newBook);
    fs.readFile(booksPath, "utf8", (err, books) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error occured");
      }
      books = JSON.parse(books);
      const lastId = books[books.length - 1].id;
      newBook.id = lastId + 1;
      const allBooks = [...books, newBook];
      fs.writeFile(booksPath, JSON.stringify(allBooks), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message: "Server error. Unable to write to database",
            })
          );
        }
        res.writeHead(201);
        res.end(JSON.stringify(newBook));
      });
    });
  });
}

function updateBook(req, res) {
  let updateDetails = "";
  req.on("data", (chunk) => {
    updateDetails += chunk;
  });
  req.on("end", () => {
    try {
      console.log(updateDetails);
      const parsedDetails = JSON.parse(updateDetails);
      console.log(parsedDetails);
      fs.readFile(booksPath, "utf8", (err, books) => {
        if (err) {
          console.log(err);
          res.writeHead(400);
          res.end("An error occurred");
          return;
        }
        const allBooks = JSON.parse(books);
        const updateIndex = allBooks.findIndex(
          (book) => book.id === parsedDetails.id
        );
        if (updateIndex === -1) {
          res.writeHead(404);
          res.end("Book not found");
          return;
        }
        console.log(updateIndex);
        allBooks[updateIndex] = { ...allBooks[updateIndex], ...parsedDetails };
        fs.writeFile(booksPath, JSON.stringify(allBooks), (err) => {
          if (err) {
            console.log(err);
            res.writeHead(500);
            res.end(
              JSON.stringify({
                message: "Server error. Unable to write to database",
              })
            );
            return;
          }
          res.writeHead(200);
          res.end(JSON.stringify(allBooks[updateIndex]));
        });
      });
    } catch (error) {
      console.log(error);
      res.writeHead(400);
      res.end("Invalid update details");
    }
  });
  req.on("error", (err) => {
    console.error("Request error:", err);
    res.writeHead(400);
    res.end("Request error");
  });
}

function deleteBooks(req, res) {
  let details = "";
  req.on("data", (chunk) => {
    details += chunk;
  });
  req.on("end", () => {
    const parsedDetails = JSON.parse(details);
    console.log(parsedDetails);
    fs.readFile(booksPath, "utf8", (err, books) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error occured");
      }
      const allBooks = JSON.parse(books);
      const updateIndex = allBooks.findIndex(
        (book) => book.id === parsedDetails.id
      );
      console.log(updateIndex);
      allBooks.splice(updateIndex, 1);
      fs.writeFile(booksPath, JSON.stringify(allBooks), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message: "Server error. Unable to write to database",
            })
          );
        }
        res.writeHead(200);
        res.end("Successfully Deleted");
      });
    });
  });
}
function loanBookOut(req, res) {
  let details = "";
  req.on("data", (chunk) => {
    details += chunk;
  });
  req.on("end", () => {
    const bookId = JSON.parse(details).id;
    fs.readFile(booksPath, "utf-8", (err, books) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("Error reading books");
      }
      let allBooks = JSON.parse(books);
      console.log(allBooks);
      let bookToLoanIndex = allBooks.findIndex((book) => book.id === bookId);
      allBooks[bookToLoanIndex].loaned = true;
      fs.writeFile(booksPath, JSON.stringify(allBooks), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message: "Server error. Unable to write to database",
            })
          );
        }
        res.writeHead(200);
        res.end("Successfully Loaned");
      });
    });
  });
}

function returnBook(req, res) {
  let details = "";
  req.on("data", (chunk) => {
    details += chunk;
  });
  req.on("end", () => {
    try {
    const bookId = JSON.parse(details).id;
    fs.readFile(booksPath, "utf-8", (err, books) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("Error reading books");
      }
      
        let allBooks = JSON.parse(books);
        let bookToLoanIndex = allBooks.findIndex((book) => book.id === bookId);
        if (bookToLoanIndex === -1) {
          res.writeHead(404);
          res.end("Book not found");
          return;
        }
        if (allBooks[bookToLoanIndex].loaned === false)
          {
            res.writeHead(404);
            res.end("This book was never loaned out in the first place");
            return;
          }
        // else {
          allBooks[bookToLoanIndex].loaned = false;
          fs.writeFile(booksPath, JSON.stringify(allBooks), (err) => {
            if (err) {
              console.log(err);
              res.writeHead(500);
              res.end(
                JSON.stringify({
                  message: "Server error. Unable to write to database",
                })
              );
            }
            res.writeHead(200);
            res.end("Successfully Returned");
          });
        // }
      
    });
  } catch (error) {
    res.end(JSON.stringify({ error }));
  }
  });
}
module.exports = {
  getAllBooks,
  addBook,
  updateBook,
  deleteBooks,
  loanBookOut,
  returnBook,
};
