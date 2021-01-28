// Modules
let express = require('express'),
    app = express(),
    router = express.Router(),
    assert = require('assert'), // Unit Tests
    http = require('http').createServer(app),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    path = require('path'), //Check what this module does exactly
    mysql = require('mysql');

// Variables
var sess;


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.engine('.html', require('ejs').__express);

app.set('views', __dirname + '/views');
app.set('view engine', 'html');

router.get('/', function(req, res){
    sess = req.session;
    res.render('index');
});

app.use('/', router);

// Establish TC/IP connection.
http.listen(8080, function() {
    console.log('Server started running at ' + Date().toString());
});

// Establish database connection.
const dbconnection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'root',
  db: 'colourify',
  insecureAuth : true
});

// Display message to console.
dbconnection.connect((err) => {
  if (err) {
      console.log("Error connecting to Db");
      return;
  }
  console.log('Connected to db');
});

/******************** REQUEST HANDLING ********************/
app.post('/login', function(request, response){
    loginUser(request, response);
});

app.get('/explore', function(request, response){
    selectAllPalettes(response);
});

app.get('/profile', function(request, response){
    getUserData(request, response);
});

app.get('/checksession', function(request, response){
    checkIfSessionActive(request, response);
});

app.get('/logout', function(request, response){
    logout(request, response);
});


/******************** QUERY FUNCTIONS ********************/
function insertUser(userData){

    let query = "INSERT INTO colourify.user(email, pass) "    +
                "VALUES ('" + userData.email + "', '" + userData.pass +"');";

    dbconnection.query(query, function(err, result){

        if(err) throw err;

        console.log(result.affectedRows + " rows updated. ID is " + result.insertId);
    }); 
}

function checkIfUserExists(userData){
    let count = 0;
    let query = "SELECT * FROM colourify.user"    +
                "WHERE  email='" + userData.email + "';";

    dbconnection.query(query, function(err, result){

        if(err) throw err;

        result.forEach(function (user){
            count++;
        });
    });
}

function loginUser(request, response){
    let query = "SELECT * FROM colourify.user "   +
                "WHERE  email='" + request.body.email +
                "' AND pass='"+ request.body.pass +"';";

    dbconnection.query(query, function(err, result){

        if(err) throw err;

        if(result.length == 0){
            response.send("invalid");
        }

        result.forEach(function (user){
            if(user.pass === request.body.pass){
                sess = request.session;
                sess.username = user.username;
                sess.loggedin = true;
                console.log("username: " + sess.username + " has logged in.");
                response.send(sess.username);
            }});

        response.end();
    });
}

function selectAllPalettes(response){
    let query = "SELECT * FROM colourify.palette";

    dbconnection.query(query, function(err, result){

        if(err) throw err;
        response.send(JSON.stringify(result));
    });

}

function insertPalette(paletteData){
    let query = "INSERT INTO palette" +
                "(creatorID, creationDate, paletteName, colour1, colour2, colour3, colour4)" +
                "VALUES ('" + paletteData.creatorID + "', '" + paletteData.creationDate + "'," +
                "'" + paletteData.paletteName + "', '" + paletteData.colour1 + "'," +
                "'" + paletteData.colour2 + "', '" + paletteData.colour3 + "'," + 
                "'" + paletteData.colour3 + "');";

    dbconnection.query(query, function(err, result){

        if(err) throw err;

        console.log(result.affectedRows + " rows updated. ID is " + result.insertId);
    }); 
}

function insertSavedPalette(){
    let query = "INSERT INTO colourify.user(email, pass) "    +
                "VALUES ('" + data.email + "', '" + data.pass +"')";

    dbconnection.query(query, function(err, result){

        if(err) throw err;

        console.log(result.affectedRows + " rows updated. ID is " + result.insertId);
    }); 
}

function getUserData(request, response){
    let palettes = [];
    let query = 
    "SELECT u.username, u.email, p.* "+
    "FROM colourify.user u, colourify.palette p "+
    "WHERE u.username = 'Adrian' " +
    "AND p.creatorUsername = 'Adrian';";
    
    // Execute Query
    dbconnection.query(query, function(err, result){

        if(err) throw err;

        result.forEach(function (userPalette){ 
                palettes.push({
                    "name" : userPalette.paletteName,
                    "creationDate" : userPalette.creationDate,
                    "colour1" : userPalette.colour1,
                    "colour2" : userPalette.colour2,
                    "colour3" : userPalette.colour3,
                    "colour4" : userPalette.colour4
                });
            });

            // Finalize dataset.
        let finishedDataSet = {
            "email" : result[0].email,
            "username" : result[0].username,
            "palettes" : palettes
        }

        JSON.stringify(finishedDataSet);
        response.send(finishedDataSet);
        }); // End query
}

function checkIfSessionActive(request, response){
    console.log(sess.loggedin);
    if(sess.loggedin){
        response.send(true);
    }

    else{
        response.send(false);
    }

}

function logout(request, response){
    request.session.destroy();
    response.send(true);
}