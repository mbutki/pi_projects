"use strict"
var express = require('express')
var mongoose = require('mongoose');
//var mysql = require("mysql");
var fs = require('fs');
var http = require('http');
var https = require('https');
var httpsRedirect = require('express-https-redirect');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Q = require("q");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express()

var db_config = JSON.parse(fs.readFileSync('/home/mbutki/pi_projects/db.config'));
var key = fs.readFileSync('/etc/letsencrypt/live/www.mbutki.com/privkey.pem');
var cert = fs.readFileSync('/etc/letsencrypt/live/www.mbutki.com/cert.pem')
var https_options = {
    key: key,
    cert: cert
};

var HTTPS_PORT = 8083
var HTTP_PORT = 8080

// First you need to create a connection to the db
//var con = mysql.createConnection(db_config);
//mongoose.connect('mongodb://localhost/piData');
var mongo_url = 'mongodb://localhost:27017/piData';

/*con.connect(function(err) {
  if(err) {
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});*/
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// PASSPORT //
app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session());

function loggedIn(req, res, next) {
    console.log('req.user:' + JSON.stringify(req.user))
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.post('/login', 
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/loginFailure'
  })
);

app.get('/logout', loggedIn, function(req, res){
  req.logout();
  res.redirect('/'); //Can fire before session is destroyed?
});

app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

app.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
});

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/login.html');
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(function(username, password, done) {
    process.nextTick(function() {
        MongoClient.connect(mongo_url, function(err, db) {
            db.collection('userInfo').findOne({'username': username}, function(err, user) {
                //let user = {user: 'admin', password: 'admin'};
                if (err) {
                    console.log('ERROR:' + JSON.stringify(err));
                    return done(err);
                }

                if (!user) {
                  return done(null, false);
                }

                if (user.password != password) {
                  return done(null, false);
                }

                return done(null, user);
            });
        });
    });
}));
///////////////

app.use('/', httpsRedirect());
app.get('/', loggedIn, function (req, res) {
  res.sendFile(__dirname + '/index.html');
})

app.use("/assets", express.static(__dirname + '/assets'));
app.use("/.well-known/acme-challenge", express.static(__dirname + '/.well-known/acme-challenge'));

app.get('/api/graphs', loggedIn, function (req, res) {
    MongoClient.connect(mongo_url, function(err, db) {
        assert.equal(null, err);
        let location2data = {};

        let past_week = {"time": {$gte: new Date(new Date()- 1000*60*60*24*7)}};
        var docs = db.collection('temperatures').find(past_week).toArray(function(err,docs){
            for (let i=0; i<docs.length; i++) {
                let doc = docs[i];
                assert.equal(err, null);
                if (doc === null) {
                    return;
                }
                if (doc !== null) {
                    if (!(doc.location in location2data)) {
                        location2data[doc.location] = {times:[], values:[]};
                    }
                    
                    location2data[doc.location].times.push(doc.time);
                    location2data[doc.location].values.push(doc.value);
                }
            }
            let data = {"graphs":[]};
            let i=0;
            for (let location in location2data) {
                data['graphs'].push({
                    "id": i.toString(),
                    "location": location,
                    "times": location2data[location].times,
                    "values": location2data[location].values
                });
                i += 1;
            }
            /*let data = {"data":[]};
            let i=0;
            for (let location in location2data) {
                data['data'].push({
                    "id": i.toString(),
                    "type": "graph",
                    "attributes": {
                        "location": location,
                        "times": location2data[location].times,
                        "values": location2data[location].values
                    }
                });
                i += 1;
            }*/
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        })
    });
})

/*app.get('*',function (req, res) {
  res.sendFile(__dirname + '/index.html');
});*/


var server = https.createServer(https_options, app).listen(HTTPS_PORT);

var httpserver = http.createServer(app).listen(HTTP_PORT);

server.on('error', function (err) {
    console.log(err);
}); 
