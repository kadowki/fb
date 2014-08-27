/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    User      = require('../../app/models/user'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'fb',
    Mongo     = require('mongodb');

describe('User', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new User object', function(){
      var u = new User();
      expect(u).to.be.instanceof(User);
    });
  });

  describe('#save', function(){
    it('should save a users profile changes to the database',function(done){
      var user = new User({email:'face@face.com',password:'face',_id:Mongo.ObjectID('000000000000000000000010')}),
      reqBody = {facebook:'face',twitter:'@face',phone:'555-5555',visible:'public'};
      user.save(reqBody, function(err, user){
        expect(user.facebook).to.equal('face');
        done();
      });
    });
  });

  describe('.all', function(){
    it('should display all public users', function(){
      User.all(function(err, users){
        expect(users).to.have.length(2);
      });
    });
  });
});

