const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 9999;

app.use(express.json());
//app.use(bodyParser.json());

app.post('/actions/profile/internal', (req, res) => {
  const receivedData = req.body;

  res.status(200).json({
    message: 'Data received',
    receivedData: receivedData
  });
});

app.listen(port, () => {
  console.log('Server is running on port: ' + port + ' ...');
})
