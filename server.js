/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part
* Of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Devarsh Yatinbhai Dave ID: 163077217 Date: 10/14/2022

*
* Online (Cyclic) Link: https://busy-red-perch-tam.cyclic.app/about
*
********************************************************************************/

var express = require("express");
var app = express();
var path = require('path');
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
var blogservice = require(__dirname + '/blog-service.js');

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log('Express http server listening on ' + HTTP_PORT);
}

cloudinary.config({
    cloud_name: 'djimq7jgi',
    api_key: '356968492474775',
    api_secret: 'QsnKPtzL0UyxUabsJ4xrY1-iULs',
    secure: true
});

const upload = multer() // no { storage: storage }

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/about')
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

app.get("/blog", function(req, res) {
    blogservice.getPublishedPosts().then(function(data) {
        res.json({ data });
    }).catch(function(err) {
        res.json({ message: err });
    })
});

app.get("/posts", function(req, res) {

    if (req.query.category) {
        blog.getPostsByCategory(req.query.category).then((data) => {
            res.json(data);
        }).catch(function(err) {
            res.json({ message: err });
        })
    } else if (req.query.minDate) {
        blog.getPostsByMinDate(req.query.minDate).then((data) => {
            res.json(data);
        }).catch(function(err) {
            res.json({ message: err });
        })
    } else {
        blogservice
            .getAllPosts()
            .then(function(data) {
                res.json(data);
            })
            .catch(function(err) {
                res.json({ message: err });
            });
    }
});

app.get('/post/:id', (req, res) => {
    blog.getPostById(req.params.id).then((data) => {

        res.json(data);
    }).catch(function(err) {
        res.json({ message: err });
    });


});

app.get("/categories", function(req, res) {
    blogservice.getCategories().then(function(data) {
        res.json({ data });
    }).catch(function(err) {
        res.json({ message: err });
    })
});


app.get('/posts/add', function(req, res) {
    res.sendFile(path.join(__dirname + "/views/addPost.html"));
});

app.post('/posts/add', upload.single("featureImage"), (req, res) => {

    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }
    upload(req).then((uploaded) => {
        req.body.featureImage = uploaded.url;
        blogservice.addPost(req.body).then(() => {
            res.redirect('/posts');
        }).catch((data) => { res.send(data); })
    });

})


app.get('*', function(req, res) {
    res.status(404).send("Page Not Found!");
});

blogservice.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart());
}).catch(() => {
    console.log("ERROR : From starting the server");
});