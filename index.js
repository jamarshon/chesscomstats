const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const https = require('https')

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/test', (req, res) => {
    const username = req.query.username;
    https.get('https://www.chess.com/callback/live/stats/' + username + '/chart?type=blitz', (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        res.json(JSON.parse(data));
      });
    }).on("error", (err) => {
      res.status(500).send("Error: " + err.message);
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))