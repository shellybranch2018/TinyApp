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


function generateRandomString() {
var alphaString = Math.random().toString(32).replace('0.', '');

return alphaString.slice(0,6);
}

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

// This will update the URL
app.post("/urls/:id", (req, res) => {
urlDatabase[req.params.id] = req.body.newlongURL;


res.redirect("/urls/");
});



app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, name:req.cookies[name] };
  
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  var shortURL = generateRandomString();
  var longURL = req.body.longURL;
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {

  let templateVars = { 
    shortURL: req.params.id,
    urls: urlDatabase,
    longURL: urlDatabase[req.params.id],
    
    };

//let templateVars = { urls: urlDatabase };
  

//console.log(postlongName + "test2")

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {

let longURL = urlDatabase[req.params.shortURL];


  res.redirect(longURL);
});

// This takes the full url and whatever is submitted is sent to the urls_show page.

app.post("/urls", (req, res) => {
  var shortURL = generateRandomString();
  var longURL = req.body.longURL;

  urlDatabase[shortURL] = longURL;
  //console.log(urlDatabase);
  console.log(req.body);  // debug statement to see POST parameters
  //console.log("/urls/" + shortURL)
  res.redirect("/urls/");

});







app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});