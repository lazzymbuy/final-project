const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const {getHomePage} = require('./routes/guru/index-guru');
const {getHomePage2} = require('./routes/murid/index-murid');
const {getHomePage3} = require('./routes/awal');
const {getAdminPage} = require('./routes/admin/index-admin');
const {addguruPage, addguru, deleteguru, editguru, editguruPage} = require('./routes/guru/guru');
const {addmuridPage, addmurid, deletemurid, editmurid, editmuridPage} = require('./routes/murid/murid');
const {addadminPage, addadmin, deleteadmin, editadmin, editadminPage} = require('./routes/admin/admin');
const port = 2707;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'lazzymbuy',
    database: 'finalproject'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

app.get('/', getHomePage3);
app.get('/admin', getAdminPage);
app.get('/guru', getHomePage);
app.get('/murid', getHomePage2);
app.get('/addadmin', addadminPage);
app.get('/addguru', addguruPage);
app.get('/addmurid', addmuridPage);
app.get('/editadmin/:id', editadminPage);
app.get('/editguru/:id', editguruPage);
app.get('/editmurid/:id', editmuridPage);
app.get('/deleteadmin/:id', deleteadmin);
app.get('/deleteguru/:id', deleteguru);
app.get('/deletemurid/:id', deletemurid);
app.post('/addadmin', addadmin);
app.post('/addguru', addguru);
app.post('/addmurid', addmurid);
app.post('/editadmin/:id', editadmin);
app.post('/editguru/:id', editguru);
app.post('/editmurid/:id', editmurid);


// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
