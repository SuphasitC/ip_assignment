const express = require('express');
const app = express();
const port = 8000;
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

//MongoDB
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:40000,127.0.0.1:40001,127.0.0.1:40002/?replicaSet=regapp&readPreference=secondary"

app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello!, Welcome to RegisterApp");
});

app.get('/subjects', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        function(err, db) {
            if (err) throw err;
            var dbo = db.db("registration");
            dbo.collection("subjects").find({}).toArray((err, subjects) => {
                if (err) throw err;
                res.send(subjects);
                db.close();
            })
        }
    );
});

app.get('/subjects/:id', (req, res) => {
    var subject_id = req.params.id;
    if(subject_id.startsWith("240-")) { //maybe use another better one
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
            function(err, db) {
                if (err) throw err;
                var dbo = db.db("registration");
                dbo.collection("subjects").findOne({"subjectID": subject_id}, (err, subject) => {
                    if (err) throw err;
                    if(subject != null){
                        res.json(subject);
                    } else {
                        res.status(404).send("Cannot find this course.");
                    }
                    db.close();
                });
            }
        );
    } else {
        res.status(404).send("Cannot find this course.");
    }
});

app.listen(port, () => console.log(`Registration_System_Server is listening on port ${port}`));