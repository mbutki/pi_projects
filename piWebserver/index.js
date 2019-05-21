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
var spdy = require('spdy')

var path = require('path');
var favicon = require('serve-favicon');

var app = express()

//var index = require('./routes/index');

var db_config = JSON.parse(fs.readFileSync('/home/mbutki/pi_projects/db.config'));
var key = fs.readFileSync('/etc/letsencrypt/live/www.mbutki.com/privkey.pem');
var cert = fs.readFileSync('/etc/letsencrypt/live/www.mbutki.com/fullchain.pem')
//var cert = fs.readFileSync('/etc/letsencrypt/live/www.mbutki.com/cert.pem')
var https_options = {
    key: key,
    cert: cert
};

var HTTPS_PORT = 8083;
var HTTP_PORT = 8080;

const ASSETS_DIR = '/home/mbutki/pi_projects/piWebserver/assets';
const NODE_DIR = '/home/mbutki/pi_projects/piWebserver';

var toPush = [];

fs.readdir(ASSETS_DIR, function(err, items) {
    for (var i=0; i<items.length; i++) {
        let filename = items[i];
        console.log('Assets dir:' + filename);
        let stat = fs.statSync(ASSETS_DIR + '/' + filename);
        if (!stat.isDirectory()){
            toPush.push(filename)
        }
    }
});

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));

// PASSPORT //
app.use(session({ secret: 'anything', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

function loggedIn(req, res, next) {
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
  // mike
  for (var i=0; i<toPush.length; i++) {
    let filename = toPush[i];
    let ext = filename.slice(-3);
    let mime = '';
    if (ext === '.js') {
        mime = 'application/javascript';
    }
    else if (ext === 'css'){
        mime = 'text/css';
    }
    let filepath = '/assets/' + filename;
    if (mime !== '') {
        pushFile(res, filepath, mime);
    }
  }
  res.sendFile(__dirname + '/login.html');
});

let pushFile = function(res, filepath, mime){
  console.log('trying to push:' + filepath + ' with mime:' + mime);
  let file = fs.readFileSync('/home/mbutki/pi_projects/piWebserver' + filepath);
  let stream = res.push(filepath, {
    status: 200, // optional
    method: 'GET', // optional
    request: {
      accept: '*/*'
    },
    response: {
      'content-type': mime
    }
  });
  stream.on('error', function(error) {
    console.log('push stream had error:' + error);
  });
  stream.end(file);
}


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

app.use('/assets', loggedIn, express.static(ASSETS_DIR));
//app.use('/', express.static(NODE_DIR));
app.use('/', loggedIn, express.static(NODE_DIR));

app.use('/', httpsRedirect());

app.get('/', loggedIn, function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//app.use("/", express.static(__dirname + '/'));
//app.set('view engine', 'html');
app.use("/.well-known/acme-challenge", express.static(__dirname + '/.well-known/acme-challenge'));

function stdDataFetch(req, res, collection_name, api_name) {
    MongoClient.connect(mongo_url, function(err, db) {
        assert.equal(null, err);
        let location2data = {};

        let past_week = {"time": {$gte: new Date(new Date()- 1000*60*60*24*7)}};
        var docs = db.collection(collection_name).find(past_week, {'sort': 'time'}).toArray(function(err,docs){
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
            let data = {};
            data[api_name] = [];
            let i=0;
            for (let location in location2data) {
                data[api_name].push({
                    "id": i.toString(),
                    "location": location,
                    "times": location2data[location].times,
                    "values": location2data[location].values
                });
                i += 1;
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        })
    });
}

function securityStatusDataFetch(req, res, collection_name, api_name) {
    MongoClient.connect(mongo_url, function(err, db) {
        assert.equal(null, err);
        let location2data = {};

        let past_week = {"time": {$gte: new Date(new Date()- 1000*60*60*24*7)}};
        var docs = db.collection(collection_name).find(past_week, {'sort': 'time'}).toArray(function(err,docs){
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
                    let value = 0;
                    if (doc.enabled) {
                        value = 1;
                    }
                    if (doc.triggered) {
                        value = 2;
                    }
                    location2data[doc.location].values.push(value);
                }
            }
            let data = {};
            data[api_name] = [];
            let i=0;
            for (let location in location2data) {
                data[api_name].push({
                    "id": i.toString(),
                    "location": location,
                    "times": location2data[location].times,
                    "values": location2data[location].values
                });
                i += 1;
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        })
    });
}

app.get('/api/graphs', loggedIn, function (req, res) {
    stdDataFetch(req, res, 'temperatures', 'graphs');
})

app.get('/api/lights', loggedIn, function (req, res) {
    stdDataFetch(req, res, 'light', 'lights');
})

/*app.get('/api/pressures', loggedIn, function (req, res) {
    stdDataFetch(req, res, 'pressures', 'pressures');
})*/

app.get('/api/humidities', loggedIn, function (req, res) {
    stdDataFetch(req, res, 'humidities', 'humidities');
})

app.get('/api/securityStatuses', loggedIn, function (req, res) {
    securityStatusDataFetch(req, res, 'security_enable_status', 'securityStatuses');
})

//app.get('*', function (req, res) {
//app.get('*', loggedIn, function (req, res) {
  //res.sendFile(__dirname + '/index.html');
//});

var server = spdy.createServer(https_options, app).listen(HTTPS_PORT);
var httpserver = http.createServer(app).listen(HTTP_PORT);

server.on('error', function (err) {
    console.log(err);
}); 

module.exports = app;
