var express = require('express');
var cons = require('consolidate');  // npm install consolidate --save
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session'); // npm install express-session --save

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'asiakas'
});

var app=express();

// Asennus npm install handlebars --save
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

const http = require('http');

// Määritellään hostname ja portti
const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

var reqURL = function(req, res, next) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log('URL : ' + fullUrl);
    next();
}

var addOwnHeader = function(req, res, next) {
    var date = new Date;
    var d = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
    res.header('Calling-Time', 'You called my node on ' + d + ' at ' + date.toLocaleTimeString());
    next();
}

// testataan kirjautuneet käyttäjät
var sessionChecker = (req, res, next) => {
    if (req.session && req.cookies) {
        res.redirect('/client');
    } else {
        next();
    }    
};

// Session käyttö
app.set('trust proxy', 1) // trust first proxy

app.use(session({
    secret: 'tosi_salainen_merkkijono ultra_secret',
    resave: false,
    saveUninitialized: true,
    name : 'JK_session_id'
  }))

app.use(allowCrossDomain);

app.use(reqURL);

app.use(addOwnHeader);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/login', function(req, res){
    console.log('/login: data=' + JSON.stringify(req.body));
    // haetaan syötetty tunnus ja salasana muuttujiin
    let username = req.body.tunnus;
    let password = req.body.ss;

    // määritellään sql, jolla voi etsiä asiakkaan jolla on kyseinen tunnus ja salasana
    let sql = 'SELECT * FROM Asiakas WHERE TUNNUS = ' + mysql.escape(username) + ' AND SALASANA = ' + mysql.escape(password);

    // kutsutaan sql lausetta
    connection.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Error fetching data from db, reason: " + error);
          //res.send(error);
          res.send({ code: "NOT OK", error_msg: error, data: "" });
        }        
        else{
            //console.log('The solution is: ', results);

            // testataan, onko ehdot päästänyt läpi yhtään käyttäjää
            if(results.length >0){
                req.session.username = username;
                req.session.aName = results[0].NIMI;
                return res.redirect('/client');
            }
            else{
                return res.redirect('/?message=Virheellinen käyttäjätunnus tai salasana');
            }
        }
    });
}),


app.use(sessionChecker);

// logout NIMI
app.get('/client', function(req,res){

    res.render('client', {
        name: req.session.aName
    });
});

app.get('/logout', function(req,res){
    // session tyhjennys
    req.session.destroy();
    // uudelleenohjaus kirjautumissivulle
     return res.redirect('/');
});

app.get('/', function(req,res){

    let msg = 'Tervetuloa sovellukseen X';

    if ( req.query.message )
        msg = req.query.message;

    res.render('login', {
        message: msg,
    });
});

// kaikki loput polut ja millä pyynnöllä vain menee tänne
app.all('*', function(req,res){
    res.sendFile(path.join(__dirname + '/views/pageNotFound.html'));
});

app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});
