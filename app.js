//jshint esversion: 6
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
// dynamic port for heroku
const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended: true}));

//setting up local(static) location in public folder for server to access custom css and images
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', (req, res) => {

  let data = {
    // members must be array of objects
    members: [
      {
        email_address: `${req.body.email}`,
        status: "subscribed",
        merge_fields: {
          FNAME: `${req.body.fName}`,
          LNAME: `${req.body.lName}`
        }
      }
    ]
  };

  let jsonData = JSON.stringify(data);

  let options = {
    url: 'https://us3.api.mailchimp.com/3.0/lists/c82abb5cbe',
    method: "POST",
    // authorizing your api
    headers: {
      "authorization": "darius1 40286b0a010bfe26b9e7cef719f48afb-us3"
    },
    body: jsonData
  };

  request(options, (error, response, body) => {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      // code 200 means successful submisson
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
});

app.post('/failure', (req, res) => {
  // redirect to a different page
  res.redirect('/');
});

// listen on port variable or 3000
app.listen(port || 3000, () => console.log("Sever is running on port 3000"));

// API key
// 40286b0a010bfe26b9e7cef719f48afb-us3

// list id
// c82abb5cbe
