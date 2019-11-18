const functions = require('firebase-functions');
const request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
global.DOMParser = new JSDOM().window.DOMParser;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.videos = functions.https.onRequest((req, res) => {

    const url = `https://www.youtube.com/channel/${req.query.channelId || 'UCxrYck_z50n5It7ifj1LCjA'}/videos`;

    request(url, { method: 'GET' }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            var parser = new DOMParser()
            var doc = parser.parseFromString(body, 'text/html');
            var obj = {};
            doc.querySelectorAll('a').forEach(a => {
                if (a.href.indexOf('watch?v=') >= 0 && a.title) {
                    obj[a.href.substr(9)] = a.title
                }
            });
            Object.getOwnPropertyNames(obj).forEach(n => {
                if (obj[n].toLowerCase().indexOf("stream") >= 0)
                    obj["livestream"] = n
            })
            res.send(obj);
        } else
            res.send({});
    });
});
