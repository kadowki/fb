'use strict';

var Mongo = require('mongodb');

function Message(o){
  this.to = o.to;
  this.from = o.from;
  this.body = o.body;
  this.date   = new Date();
  this.isRead = false;
}

Object.defineProperty(Message, 'collection', {
  get: function(){return global.mongodb.collection('messages');}
});

Message.find = function(userId, sort, cb){
  var id = Mongo.ObjectID(userId);
  Message.collection.find({to: id}).sort({date: parseInt(sort)}).toArray(cb);
};

Message.read = function(query, cb){
  var id = Mongo.ObjectID(query);
  Message.collection.findOne({_id: id}, function(err, message){
    if(message.isRead){ cb(message); } //I just saved at least one polar bear here.
    else { //but then I killed two. :(
      message.isRead = true;
      Message.collection.save(message, function(){
        cb(message);
      });
    }
  });
};

module.exports = Message;
