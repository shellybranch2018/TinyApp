var express = require("express");
var morgan  = require('morgan');
var cookieParser = require('cookie-parser')
var app = express();
var PORT = 8080; // default port 8080
app.set("view engine", "ejs");


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieParser())




var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

console.log(users)


function generateRandomString() {
var alphaString = Math.random().toString(32).replace('0.', '');

return alphaString.slice(0,6);
}

// Register Users page
app.get("/register", (req, res) => {
  
  res.render("urls_register");
});
// captures users info and saves a cookie
app.post("/register", (req, res) => {
  let userID = generateRandomString();
  
  let email = req.body.email
  let password = req.body.password
  let id = userID;
  users[id] = { id: userID,
  email: email,
  password: password };


    res.cookie('email', email);
    res.cookie('password', password);
    res.cookie('id', userID);
    
if(email === undefined || password === undefined){
  res.status(404).send("Error 404 - You must enter a Username and Password.");
}
if(email === '' || password === ''){
  res.status(404).send("Error 404 - You must enter a Username and Password.");
}
if(users[email]){
  res.status(404).send("Error 404 - You must enter a new password.");
}
else {res.redirect("/urls/");}

  });

// Log out of session
app.post("/logout", (req, res) => {
  
  res.clearCookie('username').redirect("/urls/");
  //console.log(req.cookies.username)
});


// Sets the login cookie
app.post("/login", (req, res) => {
  
  let name = req.body.username;
 
  res.cookie('username', name);
 
  res.redirect("/urls/");
});

// Delete from database
app.post("/urls/:id/delete", (req, res) => {
  
  let shortUrl = req.params.id; 

  delete urlDatabase[req.params.id];

res.redirect("/urls/");
});

// This post updates the url from the individual url page
app.post("/urls/:id", (req, res) => {
urlDatabase[req.params.id] = req.body.newlongURL;
res.redirect("/urls/");
});




// This get take me to the urls page with the list
 app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
    username: req.cookies["username"]
  };

  res.render("urls_index", templateVars);
});

//This gets the urls/new page
app.get("/urls/new", (req, res) => {
  let templateVars = {username: req.cookies["username"]}
  var shortURL = generateRandomString();
  var longURL = req.body.longURL;
  res.render("urls_new", templateVars);
});




// When you hit the edit button you are taken to the indivual link page to make the edit
app.get("/urls/:id", (req, res) => {
  let templateVars = { 
    shortURL: req.params.id,
    urls: urlDatabase,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"],  
    };
  res.render("urls_show", templateVars);
});

// Come back and fix. This is suppose to redirect a user from the short url and open up the website of it longurl. 
app.get("/u/:shortURL", (req, res) => {

let longURL = urlDatabase[req.params.shortURL];


  res.redirect(longURL);
});

// This takes the full url and whatever is submitted is sent to the urls_show page and generating a random 
// alphanumeric string for the short url

app.post("/urls", (req, res) => {
  var shortURL = generateRandomString();
  var longURL = req.body.longURL;

  urlDatabase[shortURL] = longURL;

  res.redirect("/urls/");

});

// Port listening on localhost
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});