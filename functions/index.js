const functions = require('firebase-functions');
const request = require('request');
const jsdom = require('jsdom');
const uuidv4 = require('uuid').v4;
const { JSDOM } = jsdom;
global.DOMParser = new JSDOM().window.DOMParser;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.storage = functions.https.onRequest((req, res) => {
    if (!req.query.path)
        res.sendStatus(400);
    else {
        const bucket = 'authentic-city-church.appspot.com';
        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(req.query.path)}?alt=media&token=${uuidv4()}`;
        res.set('Content-Disposition', `attachment; filename=${req.query.path}`);
        request(url).pipe(res);
    }
});

exports.videos = functions.https.onRequest((req, res) => {

    const url = `https://www.youtube.com/channel/${req.query.channelId || 'UCxrYck_z50n5It7ifj1LCjA'}/videos`;

    request(url, { method: 'GET' }, (error, response, body) => {
        function videos(t) {
            let obj = {}, json = ""
            try {
                let parser = new DOMParser()
                let doc = parser.parseFromString(t, "text/html")
                let scripts = doc.querySelectorAll('script')
                functions.logger.debug('Found ' + scripts.length + ' scripts')
                let i = Array.from(scripts).map(s => s.innerHTML).findIndex(s => s ? s.startsWith('var ytInitialData') : false) || -1
                if (i === -1) {
                    functions.logger.error("Script not found")
                    return {}
                }
                functions.logger.info('ytInitialData found at ' + i)
                json = scripts.item(i).innerHTML.substring(20)
                json = JSON.parse(json.substring(0, json.length - 1))
                let arr = json.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].gridRenderer.items.map(i => i.gridVideoRenderer).filter(i => Boolean(i)).map(i => ({ id: i.videoId, title: i.title.runs[0].text }))
                functions.logger.debug(arr.length + ' videos')
                arr.forEach(v => obj[v.title] = v.id)
            } catch (e) {
                functions.logger.error("Error parsing videos (step 1): " + e, json || "<no json>")
                return {}
            }
            try {
                Object.getOwnPropertyNames(obj).forEach(n => {
                    if (!obj["livestream"] && (obj[n].toLowerCase().indexOf("stream") >= 0 || obj[n].toLowerCase().indexOf("experience") >= 0) && obj[n].toLowerCase().indexOf("postponed") === -1)
                        obj["livestream"] = n
                })
            } catch (e) {
                functions.logger.error("Error parsing videos (step 2): " + e, obj)
                return {}
            }
            return obj
        }

        if (!error && response.statusCode === 200) {
            var obj = videos(body.toString())

            res.send(obj);
        } else
            res.send({});
    });
});
