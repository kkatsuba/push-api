const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');
const path = require('path');
const app = express();

const subscriptions = [];
const subject = 'http://localhost:5000';
const publicKey = 'BI4VPQqyyJbIA-f95VqbjUAOYNhhCAxV6XP_nCMvGkB6i4pgrPrK54N9qTmzI6NNfhmgDGlttACcx3KjjnBhs20';
const privateKey = '1tiGtD5dYS3KDw0EKruiFKLTQoX_4CbSvX99loDiCLI';

webPush.setVapidDetails(subject, publicKey, privateKey);

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/src')));

app.listen(app.get('port'), () => {
  console.log(`Node app is running on http://localhost:${app.get('port')}`);
});

app.post('/subscribe', (req, res) => {
  const sub = req.body;
  subscriptions.push(sub);

  webPush.sendNotification(sub, JSON.stringify({
    title: 'Some Title',
    body: 'You have been subscribed to notifications. Enjoy!!'
  }))

  res.sendStatus(200);
});

app.post('/send/all', (req, res) => {
  subscriptions.forEach(sub => {
    webPush.sendNotification(sub, JSON.stringify(req.body));
  });
  res.sendStatus(200);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/index.html'));
});

