#!/bin/env node
//  OpenShift sample Node application
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    ipaddress, port;


function _terminator(sig) {
    if (typeof sig === "string") {
       console.log('%s: Received %s - terminating sample app ...',
                   Date(Date.now()), sig);
       process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()));
}

ipaddress = process.env.OPENSHIFT_NODEJS_IP;
port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

if (typeof ipaddress === "undefined") {
    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
    console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
    ipaddress = "127.0.0.1";
}

process.on('exit', function() { _terminator(); });

// Removed 'SIGPIPE' from the list - bugz 852598.
['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function(element, index, array) {
    process.on(element, function() { _terminator(element); });
});


app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

/**
Safari will connect to this endpoint to look for your push package
*/
app.post('/v1/pushPackages/:websitePushID', function (req, res) {
    var file;
    // Load your push package .zip file or dynamically create one
    // Example:
    // file = fs.readFileSync('pushpackage.zip');

    res.set({'Content-type': 'application/zip'});
    res.send(file);
});

/**
Safari will connect to this endpoint to once the user allows push notifications.
This is where you should probably do something with the token
*/
app.post('/v1/devices/:deviceToken/registrations/:websitePushID', function (req, res) {
    console.log('tokens', req.params.deviceToken);
    res.send(200);
});


/**
Safari will connect to this endpoint to if the user wants to remove push notifications.
This is where you should probably remove the token from a database or something
*/
app.delete('/v1/devices/:deviceToken/registrations/:websitePushID', function (req, res) {
    console.log('tokens', req.params.deviceToken);
    res.send(200);
});

/**
Safari will connect to this endpoint when errors occur.
*/
app.post('/v1/log', function (req, res) {
    // Do Logging Stuff
    console.log(req.body.logs);
    res.send(200);
});

app.listen(port, ipaddress, function () {
    console.log('%s: Node server started on %s:%d ...',
                Date(Date.now() ), ipaddress, port);
});
