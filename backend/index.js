const express = require('express');
const app = express();
const multer = require('multer');
var mysql = require('mysql');
const cors = require('cors');
const shortid = require('shortid');

let fileNameHolder = '';
let fileExtensionHolder = '';

app.use(cors());

app.listen(3000, function(){
    console.log("up and running");
})



app.post('/upload', function(req, res){
    var storage = multer.diskStorage({
        destination: function (req, file, cb){
            console.log("hi");
            cb(null, './uploads/');
        },
        filename: function (req, file, cb){
            const randomFileName = shortid.generate();
            const fileExtension = file.mimetype.split('/')[1];
            fileNameHolder = randomFileName;
            fileExtensionHolder = fileExtension;
            cb(null, `${randomFileName}.${fileExtension}`)
        }
    })
    let upload = multer({ storage: storage}).single('file');
    upload(req, res, (err) => {
        if(err instanceof multer.MulterError){
            console.log("Multer error: " + err);
            res.send("Error while uploading").status(500);
        }
        else if(err){
            console.log("Non Multer error: " + err);
            res.send("Error while uploading").status(500);
        }
        else{
            var connection = mysql.createConnection({
                host     : 'localhost',
                user     : 'root',
                password : '',
                database : 'filesystem'
              });

            connection.connect(() => {
                console.log("Connection to database established");
            });
            connection.query(`INSERT into files (fileid, extension) VALUES ('${fileNameHolder}', '${fileExtensionHolder}');`, (error, results, fields) => {
                if (error) throw error;
                else{
                    console.log("Record inserted successfully");
                }
            });
            connection.end();
            console.log(fileNameHolder + " From upload route");
            res.send(fileNameHolder);
            fileNameHolder = '';
            fileExtensionHolder = '';
        }
    })
})


app.get('/download/:fileid', (req, res) => {
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'filesystem'
      });

    connection.connect(() => {
        console.log("Connection to database established");

    });
    connection.query(`SELECT * from files where fileid = '${req.params.fileid}'`, (error, results, fields) => {
        if (error) throw error;
        else if(results.length === 0){
            console.log("empty");
        }
        else{
            console.log(results);
            res.download(`./uploads/${results[0].fileid}.${results[0].extension}`, 'thischange.png', (err) => {
                console.log(err);
            })
        }
    });
    
    connection.end();
})

