const http = require("http");
const server = http.createServer(requestHandler);
const HOSTNAME = "localhost";
const PORT = prprocess.env.PORT || 4000;
const { getAllBooks, addBook, updateBook, deleteBooks, loanBookOut, returnBook } = require("./helpers");
const { authenticate, createUser, authenticateWithToken } = require("./users.js");

function requestHandler(req, res) {
  if (req.url === "/books" && req.method === "GET") {
    authenticate(req, res)
      .then(() => getAllBooks(req, res))
      .catch((err) => {
        res.writeHead(400);
        res.end(JSON.stringify({ error: err }));
      });
  }
  if (req.url === "/books" && req.method === "POST") {
	// let body = "";
  //   req.on("data", (chunk) => {
  //     body += chunk;
  //   });
  //   req.on("end", () => {
  //     req.body = body;
      authenticateWithToken(req, res)
        .then(() => addBook(req, res))
        .catch((err) => {
          res.writeHead(400);
          res.end(JSON.stringify({ error: err }));
        });
    // });
  }
  if (req.url === "/users" && req.method === "POST") {
    createUser(req, res);
  }
  if (req.url === "/books" && req.method === "PUT") {
    authenticateWithToken(req, res)
      .then(() => updateBook(req, res))
      .catch((err) => {
        res.writeHead(400);
        res.end(JSON.stringify({ error: err }));
      });
  }
  if (req.url === "/books" && req.method === "DELETE") {
    authenticateWithToken(req, res)
      .then(() => deleteBooks(req, res))
      .catch((err) => {
        res.writeHead(400);
        res.end(JSON.stringify({ error: err }));
      });
  }
  if(req.url === '/loan-book' && req.method === 'PUT') {
	authenticateWithToken(req, res)
      .then(() => loanBookOut(req, res))
      .catch((err) => {
        res.writeHead(400);
        res.end(JSON.stringify({ error: err }));
      });
  }
  if(req.url === '/return-book' && req.method === 'PUT') {
	authenticateWithToken(req, res)
      .then(() => returnBook(req, res))
      .catch((err) => {
        res.writeHead(400);
        res.end(JSON.stringify({ error: err }));
      });
  }
}

server.listen(PORT, HOSTNAME, () =>
  console.log(`Server running on ${HOSTNAME} port ${PORT}`)
);
