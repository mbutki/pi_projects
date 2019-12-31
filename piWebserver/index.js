"use strict"
var express = require('express')
var mongoose = require('mongoose');
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

var path = require('path');
var favicon = require('serve-favicon');

var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var app = express()

//var index = require('./routes/index');

var db_config = JSON.parse(fs.readFileSync('/home/mbutki/pi_projects/db.config'));
/*var key = fs.readFileSync('/etc/letsencrypt/live/www.mbutki.com/privkey.pem');
var cert = fs.readFileSync('/etc/letsencrypt/live/www.mbutki.com/fullchain.pem')
var https_options = {
    key: key,
    cert: cert
};*/

var HTTPS_PORT = 8083;
var HTTP_PORT = 8080;

const ASSETS_DIR = '/home/mbutki/pi_projects/pi-react/build/';
const NODE_DIR = '/home/mbutki/pi_projects/piWebserver';

// First you need to create a connection to the db
//mongoose.connect('mongodb://localhost/piData');
var mongo_url = 'mongodb://localhost:27017/piData';

/*con.connect(function(err) {
  if(err) {
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});*/
app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// PASSPORT //
app.use(session({ secret: 'anything', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


/////// GraphQL Stuff /////
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Ds {
    loc: String
    times: [String]
    values: [Float]
  }

  type Query {
    getTemps: [Ds]
    getHumid: [Ds]
    getPressure: [Ds]
    getLight: [Ds]
  }
`);


// The root provides the top-level API endpoints
var root = {
    getTemps: async () => {
        let data = await stdDataFetch('temperatures');
        return data;
    },
    getHumid: async () => {
        let data = await stdDataFetch('humidities');
        return data;
    },
    getPressure: async () => {
        let data = await stdDataFetch('temperatures');
        return data;
    },
    getLight: async () => {
        let data = await stdDataFetch('light');
        return data;
    }
}

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
//////////////////////////

class Ds {
    constructor(loc, times, values) {
        this.loc = loc;
        this.times = times;
        this.values = values;
    }
}

async function stdDataFetch(collection_name) {
    let db = await MongoClient.connect(mongo_url);
    //MongoClient.connect(mongo_url, function(err, db) {

    let past_week = {"time": {$gte: new Date(new Date() - 1000*60*60*24*3)}};//1000*60*60*24*7)}};
    var dbo = db.db("piData");
    var raw = await dbo.collection(collection_name).find(past_week, {'sort': 'time'});
    let docs = await raw.toArray();
    let location2data = {};

    let data = [];
    for (let i=0; i<docs.length; i++) {
        let doc = docs[i];
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
    for (let location in location2data) {
        let ds = new Ds(location, location2data[location].times, location2data[location].values);
        data.push(ds);
    }
    
    return data
}

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
            var dbo = db.db("piData");
            dbo.collection('userInfo').findOne({'userName': username}, function(err, user) {
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

app.use('/', loggedIn, express.static(ASSETS_DIR));

//app.use('/', httpsRedirect());

app.get('/', loggedIn, function (req, res) {
  res.sendFile(ASSETS_DIR + 'index.html');
});

//app.use("/", express.static(__dirname + '/'));
//app.set('view engine', 'html');
app.use("/.well-known/acme-challenge", express.static(__dirname + '/.well-known/acme-challenge'));




//app.get('*', function (req, res) {
//app.get('*', loggedIn, function (req, res) {
  //res.sendFile(__dirname + '/index.html');
//});

//var server = spdy.createServer(https_options, app).listen(HTTPS_PORT);
var httpserver = http.createServer(app).listen(HTTP_PORT);

httpserver.on('error', function (err) {
    console.log(err);
}); 

module.exports = app;
