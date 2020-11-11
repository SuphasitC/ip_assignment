const { ReadPreference } = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://172.30.80.138:40000,172.30.80.30:40000,172.30.80.232:40000/?replicaSet=rx2&readPreference=secondary"
var url = "mongodb://127.0.0.1:40000,127.0.0.1:40001,127.0.0.1:40002/?replicaSet=regapp&readPreference=secondary"
var all_subject = [];

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
    function(err, db) {
        if (err) throw err;
        var dbo = db.db("registration");
        dbo.collection("subjects").find({}).toArray((err, docs) => {
            if (err) throw err;
            console.log(docs)
            all_subject = docs;
        })
    }
);

module.exports.all_subject = all_subject;
