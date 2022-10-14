const fs = require("fs"); // required at the top of your module
//Globally declared arrays
var posts = []
var categories = []
    //initialize() function that will read the content of the posts.json object
exports.initialize = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/posts.json', 'utf8', (err, data) => {
            if (err) {
                reject("unable to read file");
            } else {
                posts = JSON.parse(data);
            }
        });

        fs.readFile('./data/categories.json', 'utf8', (err, data) => {
            if (err) {
                reject("unable to read file");
            } else {
                categories = JSON.parse(data);
            }
        });
        resolve();
    })
};
//function that will provide the full array of "posts object"
exports.getAllPosts = () => {
    return new Promise((resolve, reject) => {
        if (posts.length == 0) {
            reject('no results returned');
        } else {
            resolve(posts);
        }
    })
};
//function that will provide an array of "post" objects whose published property is true
exports.getPublishedPosts = () => {
    return new Promise((resolve, reject) => {
        var publishposts = posts.filter(post => post.published == true);

        if (publishposts.length == 0) {
            reject('no results returned');
        }
        resolve(publishposts);
    })
};
//function that will provide the full array of "category" objects
exports.getCategories = () => {
    return new Promise((resolve, reject) => {
        if (categories.length == 0) {
            reject('no results returned');
        } else {
            resolve(categories);
        }
    })
};