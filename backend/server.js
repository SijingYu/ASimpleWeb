// import express from 'express';
// import mongoose from 'mongoose';

// const app = express();


// app.use('/', function (req, res) {
//   return res.json('hello world')
// })
// import bluebird from 'bluebird';
// mongoose.Promise = bluebird;

// try {
//   mongoose.connect('mongodb://localhost/test', {
//     useMongoClient: true
//   })
// } catch (error) {
//   console.log(error)
// }
// mongoose.connection
//   .once('open', function () {
//     console.log('mongoose connection')
//   })
//   .on('error', function (error) {
//     throw error;
//   })

// app.listen(8888, () => {
// })


const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./schema/data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

const dbRoute = 'mongodb://localhost/test';//'mongodb://<your-db-username-here>:<your-db-password-here>@ds249583.mlab.com:49583/fullstack_app';

mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.put('/updateData', (req, res) => {
  const { _id, name,message } = req.body;
  console.log(req.body,'data')
  Data.findByIdAndUpdate(_id, {name,message}, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.delete('/deleteData', (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

router.post('/putData', (req, res) => {
  let data = new Data();
  const { id, message, type, name } = req.body;
  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  data.message = message;
  data.id = id;
  data.name = name;
  data.type = type;
  data.save((err) => {
    console.log(err, 'add data', data)
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.get('/getTextData:searchValue', (req, res) => {
  const { searchValue } = req.params;
  console.log(req,'request');
  var query = {};
  if(!searchValue){
    query = {};
  }else{
    let regexp = new RegExp(searchValue, 'i');

    query = {
      $or: [
        { name: { $regex: regexp } },
        { message: { $regex: regexp } }
      ]
    };
  }
  console.log(req.body.searchValue, 'search')

  Data.find(query, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data || [] });
  });
});

app.use('/api', router);


app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
