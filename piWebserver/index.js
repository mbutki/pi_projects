"use strict"
var express = require('express')
var mongoose = require('mongoose');
var mysql = require("mysql");
var fs = require('fs');
var http = require('http');
var https = require('https');
var httpsRedirect = require('express-https-redirect');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Q = require("q");

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
var con = mysql.createConnection(db_config);
//mongoose.connect('mongodb://localhost/piData');
var mongo_url = 'mongodb://localhost:27017/piData';

con.connect(function(err) {
  if(err) {
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});


app.use('/', httpsRedirect());
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})

app.use("/assets", express.static(__dirname + '/assets'));
app.use("/.well-known/acme-challenge", express.static(__dirname + '/.well-known/acme-challenge'));

app.get('/graphs', function (req, res) {
    MongoClient.connect(mongo_url, function(err, db) {
        assert.equal(null, err);
        let location2data = {};

        var docs = db.collection('temperatures').find().toArray(function(err,docs){
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
            let data = {"data":[]};
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
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        })
    });

    //let query = 'select * from temperature where temperature.time between date_sub(now(),INTERVAL 1 WEEK) and now() order by temperature.time';
    //con.query(query, function(err, rows) {
        //if (err) throw err;
    /*       
        let location2data = {};
        for (let i=0; i < rows.length; i++) {
            let row = rows[i];
            if (!(row.location in location2data)) {
                location2data[row.location] = {times:[], values:[]};
            }
            
            location2data[row.location].times.push(row.time);
            location2data[row.location].values.push(row.value);
        }
        
        let i=0;
        for (let location in location2data){
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
        }      
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    */
    //});
})


var server = https.createServer(https_options, app).listen(HTTPS_PORT);

var httpserver = http.createServer(app).listen(HTTP_PORT);

server.on('error', function (err) {
    console.log(err);
}); 
