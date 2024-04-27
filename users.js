const fs = require("fs");
const path = require("path");
require('dotenv').config();
const API_KEY = process.env.API_KEY;

const usersPath = path.join(__dirname, "db", "users.json");

function getAllUsers() {
  return new Promise((resolve, reject) => {
    fs.readFile(usersPath, "utf8", (err, users) => {
      if (err) reject("An error occured while getting users");
      resolve(JSON.parse(users));
    });
  });
}

async function createUser(req, res) {
  let newUser = "";
  req.on("data", (chunk) => {
    newUser += chunk;
  });
  fs.readFile(usersPath, "utf8", (err, users) => {
    if (err) console.log("An error occured while getting users");

    const allUsers = [...JSON.parse(users), JSON.parse(newUser)];
    fs.writeFile(usersPath, JSON.stringify(allUsers), (err) => {
      if (err) console.log(err);
      else {
        console.log("File written successfully");
        res.writeHead(201);
        res.end(newUser);
      }
    });
  });
}
async function authenticate(req, res) {
  return new Promise((resolve, reject) => {
	let body = "";
    if (req.body) {
      body = req.body;
      processBody();
    } else {
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        processBody();
      });
	}
      async function processBody() {
		try {
		  const parsedBody = JSON.parse(body);
		  const loginDetails = parsedBody.users;
		  if (!loginDetails) {
			reject("Please enter your username and password");
		  }
		const users = await getAllUsers();
		const userFound = users.find(
		  (user) => user.username === loginDetails.username
		);
		if (!userFound) {
		  reject("User does not exist. Sign up instead");
		}
		if (userFound && userFound.password !== loginDetails.password) {
		  reject("Password is incorrect");
		}
		resolve(userFound);
	} catch (err) {
		reject("Invalid JSON format");
	  }
	}
	});
	}

  async function authenticateWithToken(req, res) {
    return new Promise((resolve, reject) => {
      let token = req.headers.authorization;
      if(!token) reject('Please set authorization parameters');
      if(token !== API_KEY) reject('Invalid Token');
      console.log(token)
      console.log(API_KEY);
      resolve();
    });
    }


module.exports = { authenticate, createUser, authenticateWithToken };
