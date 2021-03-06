/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'fb';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('users', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=bob@aol.com')
      .send('password=1234') //sue password: abcd
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('get /profile/edit', function(){
    it('should show the edit profile page', function(done){
      request(app)
      .get('/profile/edit')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('bob@aol.com');
        expect(res.text).to.include('Email');
        expect(res.text).to.include('Phone');
        expect(res.text).to.include('public');
        done();
      });
    });
  });

  describe('put /profile/edit', function(){
    it('should edit the profile', function(done){
      request(app)
      .put('/profile/edit')
      .send('method=put&visible=public&email=bob%40gmail.com&photo=test&tagline=test&facebook=test&twitter=test&phone=test')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/profile');
        done();
      });
    });
  });

  describe('get /profile', function(){
    it('should go to the profile page', function(done){
      request(app)
      .get('/profile')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('get /users', function(){
    it('should get all public users', function(done){
      request(app)
      .get('/users')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('get /user/:id', function(){
    it('should let show a public user', function(done){
      request(app)
      .get('/user/bob@aol.com')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should not show a private user', function(done){
      request(app)
      .get('/user/sue@aol.com')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('post /message/3', function(){
    it('should send an text to a user based on ID', function(done){
      request(app)
      .post('/message/000000000000000000000002')
      .set('cookie', cookie)
      .send('mtype=text&message=hey, hey, hey')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.header.location).to.equal('/user/sue@aol.com');
        done();
      });
    });
  });

  describe('post /message/3', function(){
    it('should send an email to a user based on ID', function(done){
      request(app)
      .post('/message/000000000000000000000002')
      .set('cookie', cookie)
      .send('mtype=email&message=hey, hey, hey')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.header.location).to.equal('/user/sue@aol.com');
        done();
      });
    });
  });

  describe('post /message/3', function(){
    it('should send an internal to a user based on ID', function(done){
      request(app)
      .post('/message/000000000000000000000002')
      .set('cookie', cookie)
      .send('mtype=internal&message=hey, hey, hey')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.header.location).to.equal('/user/sue@aol.com');
        done();
      });
    });
  });

  describe('get /messages', function(){
    it('should display all incoming messsages', function(done){
      request(app)
      .get('/messages')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('get /messages/:messageId/view', function(){
    it('should display a single message from a given users', function(done){
      request(app)
      .get('/message/53ffc8a77eedeb1a14f69131/view')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

});

