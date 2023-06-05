const express = require('express');
const mysql2 = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1111',
  database: 'trial',
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname , 'public' , 'index.html'));
  });
  
  app.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname , 'public' , 'signup.html'));
  });
  
  app.post('/signup', function (req, res) {
    const { username, email, password } = req.body;
    if (username && email && password) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.log(err);
          res.redirect('/signup');
        } 
        else {
          const sql =
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
          connection.query(sql, [username, email, hash], (err, result) => {
            if (err) {
              console.log(err);
              res.redirect('/signup');
            } else {
              console.log(result);
              req.session.loggedin = true;
              req.session.username = username;
              res.redirect('/info');
            }
          });
        }
      });
    } else {
      res.redirect('/signup');
    }
  });


const port = 5000;

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});