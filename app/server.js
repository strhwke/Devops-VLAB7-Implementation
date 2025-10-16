'use strict';

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const color = process.env.COLOR || 'blue';

app.get('/', (req, res) => {
  res.json({ app: 'myapp', color, version: process.env.VERSION || 'v1', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`myapp listening on port ${port}, color=${color}`);
});




