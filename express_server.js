var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
app.set("view engine", "ejs");
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
  var ranString = " ";
  var orderString = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var x = 0; x < 7; x++){
    ranString += orderString.charAt(Math.floor(Math.random()*orderString.length));
  };
  return ranString;
};

//LIST OF URLS //
app.get("/urls", (request, respond) => {
  console.log('hello');
  let templateVars = { urls: urlDatabase };
  respond.render("urls_index", templateVars);
});


// DELETE URLS ///
app.post("/urls/:id/delete", (request, respond) => {
  const shortURL = request.params.id;
  delete urlDatabase[shortURL];
  respond.redirect('/urls')
});

//UPDATE URL //
app.post("/urls/:id/update", (request, respond) => {
  console.log(request.body.longURL);
  urlDatabase[request.params.id] = request.body.longURL;
  respond.redirect('/urls'); // responds to client with a redirect request (ie: please do a GET request to this url pattern)
});

// NEW URL INPUT //
app.get("/urls/new", (request, respond) => {
  respond.render("urls_new");
});

// SHOWS THE SINGLE URL SHORT AND LONG, BASED ON THE ID YOU PROVIDE (SHORT) //
app.get("/urls/:id", (request, respond) => {
  let templateVars = { shortURL: request.params.id, longURL: urlDatabase[request.params.id]};
  respond.render("urls_show", templateVars);
});

// GENERATE SHORT URL ///
app.post("/urls", (request, respond) => {
  let shortRandomURL = generateRandomString();
  //console.log(request.body);  // debug statement to see POST parameters
  urlDatabase[shortRandomURL] = request.body.longURL;         // Respond with 'Ok' (we will replace this)
  respond.redirect("/u/" + shortRandomURL);

});

// REDIRCTS THE SHORT URL TO THE LONG URL //
app.get("/u/:shortURL", (request, respond) => {
  let longURL = "https://" + urlDatabase[request.params.shortURL];
  respond.redirect(longURL);
});



//OTHER CRAP //

app.get("/", (request, responsd) => {
  respond.send("Hello!");
});

app.get("/urls.json", (request, respond) => {
  respond.json(urlDatabase);
});

app.get("/hello", (request, respond) => {
  respond.send("<html><body>Hello <b>World</b></body></html>\n");
});

/// LISTEN ///

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});