require('dotenv').config()
process.env.NODE_ENV = "test"
const server = require ('../bin/www')
const chai = require ('chai')
const chaiHttp = require ('chai-http')
const mongoose = require ('mongoose')
const User = require ('../models/user')
chai.should() 
chai.use(chaiHttp)
let url = "http://localhost:3000"
let userId = ""
let idTelegram = ""

describe('User', function() {
  this.timeout(500000)
  beforeEach((done) => {
    mongoose.connect(process.env.MONGO_URI_TEST, { useNewUrlParser: true }).then (function () {
      User.create({
        firstName: "made",
        lastName: "sumarsana",
        email: "made.sumarsana@gmail.com",
        address: "tanah kusir",
        phoneNumber: "08123457823",
        idTelegram: "1234",
        propicURL: "http://newbabywallpapers.in/image/baby-image-photo-and-wallpaper/baby-image-photo-and-wallpaper-12.jpg"
      })
      .then ( function (result) {
        userId = result._id
        idTelegram = result.idTelegram
        done()
      })
      .catch (function (err) {
        done()
      })
    })
  })

  afterEach((done) => {
    User.collection.drop()
    .then (function () {
      // console.log("drop User collection");
      done()
    })
  })

  it('POST  /users should success register a new user', function(done) {
    chai.request(url)
      .post('/users')
      .send({
        firstName: "adi",
        lastName: "putra",
        email: "adi.putra@gmail.com",
        address: "tanah kusir",
        phoneNumber: "08123457823",
        idTelegram: "223344",
        propicURL: "http://newbabywallpapers.in/image/baby-image-photo-and-wallpaper/baby-image-photo-and-wallpaper-12.jpg"
      })
      .end(function(err, res) {
        res.should.have.status(200)
        res.should.be.json;
        res.body.should.be.a('object')
        res.body.msg.should.equal('successfully create user')
        res.body.data.should.be.a('object')
        res.body.data.should.have.property('firstName')
        res.body.data.should.have.property('lastName')
        res.body.data.should.have.property('email')
        res.body.data.should.have.property('address')
        res.body.data.should.have.property('phoneNumber')
        res.body.data.should.have.property('idTelegram')
        res.body.data.should.have.property('propicURL')
        res.body.data.should.have.property('createdAt')
        res.body.data.should.have.property('updatedAt')
        res.body.data.firstName.should.equal('adi')
        res.body.data.lastName.should.equal('putra')
        res.body.data.email.should.equal('adi.putra@gmail.com')
        res.body.data.address.should.equal('tanah kusir')
        res.body.data.phoneNumber.should.equal('08123457823')
        res.body.data.idTelegram.should.equal('223344')
        res.body.data.propicURL.should.equal('http://newbabywallpapers.in/image/baby-image-photo-and-wallpaper/baby-image-photo-and-wallpaper-12.jpg')        
        done()  
      })
  })

  it('POST  /users should error register a new user when required field not exist', function(done) {
    chai.request(url)
      .post('/users')
      .send({
        firstName: "adi",
        lastName: "putra"
      })
      .end(function (err, res) {
        res.should.have.status(400)
        done()
    })
  })

  it('POST /users should unable register using existed email or id telegram', function (done) {
    chai.request(url)
      .post('/users')
      .send({
        firstName: "made",
        lastName: "sumarsana",
        email: "made.sumarsana@gmail.com",
        address: "tanah kusir",
        phoneNumber: "08123457823",
        idTelegram: "1234",
        propicURL: "http://newbabywallpapers.in/image/baby-image-photo-and-wallpaper/baby-image-photo-and-wallpaper-12.jpg"
      })
      .end(function (err,res) {
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.msg.should.equal('telegram Id or email already exist, please choose another telegram Id or email')
        done()
      })
  })

  it('Get /users should return array of user',  function (done) {
    chai.request(url)
      .get('/users')
      .end(function (err, res) {
          res.should.have.status(200)
          res.should.be.json
          res.should.be.a('object')
          res.body.msg.should.equal("successfully get all user")
          done()
      })
  })

  it('Get /users/:id should return user by telegram id',  function (done) {
    chai.request(url)
      .get(`/users/one/${idTelegram}`)
      .end(function (err, res) {
          res.should.have.status(200)
          res.should.be.json
          res.should.be.a('object')
          res.body.msg.should.equal("successfully get user")
          res.body.data.should.have.property('firstName')
          res.body.data.should.have.property('lastName')
          res.body.data.should.have.property('email')
          res.body.data.should.have.property('address')
          res.body.data.should.have.property('phoneNumber')
          res.body.data.should.have.property('idTelegram')
          res.body.data.should.have.property('propicURL')
          res.body.data.should.have.property('createdAt')
          res.body.data.should.have.property('updatedAt')
          res.body.data.firstName.should.equal('made')
          res.body.data.lastName.should.equal('sumarsana')
          res.body.data.email.should.equal('made.sumarsana@gmail.com')
          res.body.data.address.should.equal('tanah kusir')
          res.body.data.phoneNumber.should.equal('08123457823')
          res.body.data.idTelegram.should.equal('1234')
          res.body.data.propicURL.should.equal('http://newbabywallpapers.in/image/baby-image-photo-and-wallpaper/baby-image-photo-and-wallpaper-12.jpg')
          done()
      })
  })

  it('PUT /users/:id should able update user',  function (done) {
    chai.request(url)
      .put(`/users/${userId}`)
      .end(function (err, res) {
          res.should.have.status(200)
          res.should.be.json
          res.should.be.a('object')
          res.body.msg.should.equal("update user success")
          done()
      })
  })

  it('DELETE /users/:id should able delete user',  function (done) {
    chai.request(url)
      .delete(`/users/${userId}`)
      .end(function (err, res) {
          res.should.have.status(200)
          res.should.be.json
          res.should.be.a('object')
          res.body.message.should.equal("delete user success")
          done()
      })
  })

  it('DELETE /users/:id with invalid id should return error',  function (done) {
    chai.request(url)
      .delete(`/users/123213`)
      .end(function (err, res) {
          res.should.have.status(400)
          done()
      })
  })

  it('UPDATE /users/:id with invalid id should return error',  function (done) {
    chai.request(url)
      .put(`/users/123213`)
      .end(function (err, res) {
          res.should.have.status(400)
          done()
      })
  })

  it('GET /users/one/:id with invalid object id should return error',  function (done) {
    chai.request(url)
      .get(`/users/one/123213`)
      .end(function (err, res) {
          res.should.have.status(400)
          done()
      })
  })
})
