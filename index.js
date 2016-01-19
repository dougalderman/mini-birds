var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var cors = require('cors');
var ObjectId = require('mongodb').ObjectId;

var app = express();
app.use(bodyParser.json());

var nodePort = 3000;

var db = mongojs('birds', ['sightings']);

app.post('/api/sighting', function(req, res) {
    var dataToInsert = req.body;
    db.sightings.insert(dataToInsert, function(err, result) {
    
        if(err) {
            res.status(500).end();
        }
        res.send(result);
    });
    
    console.log('post hit');
});

app.get('/api/sighting', function(req, res) {
    db.sightings.find({}, function(err, result) {
        res.send(result);
    });
    console.log('get hit');
});

app.delete('/api/sighting/:id', function(req, res) {
    
    var idToDelete = ObjectId(req.params.id);
    
     db.sightings.remove({_id: idToDelete}, function(err, result) {
         if(err) {
             res.status(500).send("Failed to delete");
         }
         res.send("Successfully deleted record");
     });
    console.log('delete hit');
   
});

app.put('/api/sighting/:id', function(req, res) {

    var idToModify = ObjectId(req.params.id);
    var updateObject = {
        query: {_id: idToModify},
        update: { $set: req.body},  // $set--just set one property of object
        new: false
    }
    
    db.sightings.findAndModify(updateObject, function(err, result) {
        res.send(result);
    });
    
    console.log('put hit');
    
});

app.listen(nodePort, function() {
    console.log('listening to port ', nodePort);
});
