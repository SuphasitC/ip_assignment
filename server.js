const express = require('express');
const app = express();
const port = 8000;
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const redis = require('redis');
const redisClient = redis.createClient();

var subjects = [
    {
        "subjectID": "240-101",
        "subjectName": "Intro to Computer Programming",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 39,
        "maximum": 40
    },
    {
        "subjectID": "240-203",
        "subjectName": "Computer Engineering Software Laboratory II",
        "weight": 1,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 38,
        "maximum": 40
    },
    {
        "subjectID": "240-204",
        "subjectName": "Computer Engineering Hardware Laboratory II",
        "weight": 1,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 19,
        "maximum": 50
    },
    {
        "subjectID": "240-205",
        "subjectName": "Electric Circuits",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 19,
        "maximum": 30
    },
    {
        "subjectID": "240-206",
        "subjectName": "Intro to Computer Networks",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 20,
        "maximum": 30
    },
    {
        "subjectID": "240-207",
        "subjectName": "Programming and Data Structures",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 39,
        "maximum": 60
    },
    {
        "subjectID": "240-208",
        "subjectName": "Digital Logic and Design",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 49,
        "maximum": 50
    },
    {
        "subjectID": "240-209",
        "subjectName": "Basic Electronics",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 48,
        "maximum": 70
    },
    {
        "subjectID": "240-210",
        "subjectName": "Programming Technique",
        "weight": 2,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 51,
        "maximum": 60
    },
    {
        "subjectID": "240-211",
        "subjectName": "Software Engineering",
        "weight": 2,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 41,
        "maximum": 50
    },
    {
        "subjectID": "240-212",
        "subjectName": "Probability and Statistic",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 57,
        "maximum": 60
    },
    {
        "subjectID": "240-213",
        "subjectName": "Discrete Mathematics",
        "weight": 2,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 51,
        "maximum": 60
    },
    {
        "subjectID": "240-214",
        "subjectName": "Data Communication and Networking",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 52,
        "maximum": 60
    },
    {
        "subjectID": "240-215",
        "subjectName": "Computer Engineering Mathematics",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 51,
        "maximum": 80
    },
    {
        "subjectID": "240-301",
        "subjectName": "Advanced Computer Engineering Laboratory I",
        "weight": 1,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 59,
        "maximum": 60
    },
    {
        "subjectID": "240-302",
        "subjectName": "Advanced Computer Engineering Laboratory II",
        "weight": 1,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 51,
        "maximum": 70
    },
    {
        "subjectID": "240-303",
        "subjectName": "Ethical, Legal and Social Issues",
        "weight": 1,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 51,
        "maximum": 60
    },
    {
        "subjectID": "240-304",
        "subjectName": "Computer Operating System",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 39,
        "maximum": 60
    },
    {
        "subjectID": "240-305",
        "subjectName": "Database Systems",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 41,
        "maximum": 45
    },
    {
        "subjectID": "240-306",
        "subjectName": "Wireless and Mobile Networks",
        "weight": 2,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 51,
        "maximum": 60
    },
    {
        "subjectID": "240-307",
        "subjectName": "Computer Architecture and Organization",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 51,
        "maximum": 70
    },
    {
        "subjectID": "240-308",
        "subjectName": "Computer Engineering Project Preparation",
        "weight": 2,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 19,
        "maximum": 50
    },
    {
        "subjectID": "240-309",
        "subjectName": "Microcontroller and Interfacing",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 52,
        "maximum": 60
    },
    {
        "subjectID": "240-310",
        "subjectName": "Algorithms: Design and Analysis",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 41,
        "maximum": 71
    },
    {
        "subjectID": "240-311",
        "subjectName": "Distributed Computing and Web Technologies",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 51,
        "maximum": 70
    },
    {
        "subjectID": "240-312",
        "subjectName": "Computer Security",
        "weight": 3,
        "departure": "Computer Engineering",
        "faculty": "Engineering",
        "registered": 51,
        "maximum": 90
    }
];

//MongoDB
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:40000,127.0.0.1:40001,127.0.0.1:40002/?replicaSet=regapp&readPreference=secondary"

//to check that this subject is in your database
var isValidSubject = async (subject_id) => {
    if(subject_id.startsWith("240-")) {
        await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
            (err, db) => {
                if (err) throw err;
                var dbo = db.db("registration");
                dbo.collection("subjects").findOne({"subjectID": subject_id}, (err, subject) => {
                    if (err) throw err;
                    if(subject != null) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
        );
    } else {
        return false;
    }
}

// to check that this person can register this course
// var isAbleToRegister = async (subject_id) => {
//         await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
//             (err, db) => {
//                 if (err) throw err;
//                 var dbo = db.db("registration");
//                 dbo.collection("subjects").findOne({"subjectID": subject_id}, (err, subject) => {
//                     if (err) throw err;
//                     if(subject.registered != null) {

//                     } else {

//                     }
//                 });
//             }
//         );
// }


app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello!, Welcome to RegisterApp");
    subjects.forEach((subject, index) => {
        redisClient.set(subject.subjectID, subject.registered.toString());
        redisClient.set(subject.subjectID + "Max", subject.maximum.toString())
    });
});

app.get('/subjects', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, db) => {
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

//to register in :id course
app.get('/subjects/:id/register', (req, res) => {
    var subject_id = req.params.id;
    var max;
    redisClient.get(subject_id + "Max",(err, maximum) => {
        if (err) throw err;
        max = maximum;
    });
    redisClient.get(subject_id, (err, registered) => {
        if (err) throw err;
        if (parseInt(registered) + 1 <= max) {
            redisClient.incr(subject_id);
            res.send(`number of registered student in ${subject_id} is ${registered}/${max}`);

        } else {
            res.send(`${subject_id} is full now (max = ${max})`)
        }
    });
});

app.get('/subjects/:id', (req, res) => {
    var subject_id = req.params.id;
    if(isValidSubject(subject_id)) {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
            (err, db) => {
                if (err) throw err;
                var dbo = db.db("registration");
                dbo.collection("subjects").findOne({"subjectID": subject_id}, (err, subject) => {
                    if (err) throw err;
                    res.json(subject);
                    db.close();
                });
            }
        );
    } else {
        res.status(404).send("Cannot find this course.");
    }
});

/*---------------------------------------------- add and delete all ----------------------------------------------*/
app.get('/add_subjects', async (req, res) => {
    await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, db) => {
            if (err) throw err;
            var dbo = db.db("registration");
            dbo.collection('subjects').insert(subjects);
            res.send(subjects);
        }
    );
});

app.get('/delete_subjects', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        (err, db) => {
            if (err) throw err;
            var dbo = db.db("registration");
            dbo.collection('subjects').drop();
            res.send("All Subjects are deleted.");
        }
    );
});
/*------------------------------------------------------------------------------------------------------------------*/

app.listen(port, () => console.log(`Registration_System_Server is listening on port ${port}`));