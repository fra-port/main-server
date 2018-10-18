require('dotenv').config()
process.env.NODE_ENV = "test"
const server = require('../bin/www')
const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const sellingHistory = require('../models/sellingHistory')
const User = require('../models/user')
chai.should()
chai.use(chaiHttp)
let url = "http://localhost:3000"
let historyId = ""
let userId = ""
let idTelegram = ""

describe('Selling History', function () {
    this.timeout(500000)
    beforeEach((done) => {
        mongoose.connect(process.env.MONGO_URI_TEST, { useNewUrlParser: true }).then(function () {

            User.create({
                firstName: "made",
                lastName: "sumarsana",
                email: "made.sumarsana@gmail.com",
                address: "tanah kusir",
                phoneNumber: "08123457823",
                idTelegram: "1234",
                propicURL: "http://newbabywallpapers.in/image/baby-image-photo-and-wallpaper/baby-image-photo-and-wallpaper-12.jpg"
            })
                .then(function (result) {
                    userId = result._id
                    idTelegram = result.idTelegram

                    if (result) {

                        sellingHistory.create({
                            userId: userId,
                            selling: [{
                                itemName: "dada",
                                quantity: 1,
                                Total: 10000
                            }, {
                                itemName: "paha",
                                quantity: 2,
                                total: 15000
                            }]
                        })
                            .then(function (resultHistory) {
                                // console.log('oooo',result);

                                historyId = resultHistory._id
                                done()
                            })
                            .catch(function (err) {
                                done()
                            })
                    }
                })
                .catch(function (err) {
                    done()
                })

        })
    })

    afterEach((done) => {

        User.collection.drop()
            .then(function () {
                sellingHistory.collection.drop()
                    .then(function () {
                        done()
                    })
            })

    })

    it('POST  /selling should success create a selling history', function (done) {
        chai.request(url)
            .post('/selling')
            .send({
                idTelegram: idTelegram,
                item: [{
                    itemName: "dada",
                    quantity: 1,
                    Total: 10000
                }, {
                    itemName: "paha",
                    quantity: 2,
                    total: 15000
                }]
            })
            .end(function (err, res) {

                res.should.have.status(201)
                res.should.be.json;
                res.body.should.be.a('object')
                res.body.msg.should.equal('create selling succes')
                res.body.result.should.be.a('object')
                res.body.result.should.have.property('userId')
                res.body.result.should.have.property('selling')
                res.body.result.should.have.property('createdAt')
                res.body.result.should.have.property('updatedAt')
                done()
            })
    })

    it('POST  /selling should error create selling history when required field not exist', function (done) {
        chai.request(url)
            .post('/selling')
            .send({
                userId: userId,
            })
            .end(function (err, res) {
                res.should.have.status(200)
                done()
            })
    })

    it('Get /selling should return array of selling history', function (done) {
        chai.request(url)
            .get('/selling')
            .end(function (err, res) {

                res.should.have.status(200)
                res.should.be.json
                res.should.be.a('object')
                res.body.should.be.a('array')
                res.body.should.have.lengthOf(1)
                res.body[0].should.have.property('_id')
                done()
            })
    })

    it('Get /selling/:id should return selling history by id', function (done) {
        chai.request(url)
            .get(`/selling/${historyId}`)
            .end(function (err, res) {
                ;

                res.should.have.status(200)
                res.should.be.json
                res.should.be.a('object')
                res.body.msg.should.equal("data found")
                res.body.result.should.be.a("object")
                done()
            })
    })

    it('Get /selling/:id should return error selling', function (done) {
        chai.request(url)
            .get(`/selling/${userId}`)
            .end(function (err, res) {
                ;

                res.should.have.status(200)
                res.should.be.json
                res.should.be.a('object')
                res.body.msg.should.equal("data  not found")
                done()
            })
    })

    it('Get /selling/:id should return catch error selling', function (done) {
        chai.request(url)
            .get(`/selling/1`)
            .end(function (err, res) {
                ;
                res.should.have.status(500)
                res.should.be.json
                res.should.be.a('object')
                done()
            })
    })

    it('PUT /selling/:id should able update user', function (done) {
        chai.request(url)
            .put(`/selling/${historyId}`)
            .end(function (err, res) {
                res.should.have.status(200)
                res.should.be.json
                res.should.be.a('object')
                res.body.msg.should.equal("update succes")
                done()
            })
    })

    it('PUT /selling/:id should error update user', function (done) {
        chai.request(url)
            .put(`/selling/1`)
            .end(function (err, res) {
                res.should.have.status(500)
                res.should.be.json
                res.should.be.a('object')
                done()
            })
    })

    it('DELETE /selling/:id should able delete user', function (done) {
        chai.request(url)
            .delete(`/selling/${userId}`)
            .end(function (err, res) {
                res.should.have.status(200)
                res.should.be.json
                res.should.be.a('object')
                res.body.msg.should.equal("delete succes")
                done()
            })
    })

    it('DELETE /selling/:id should error delete user', function (done) {
        chai.request(url)
            .delete(`/selling/1`)
            .end(function (err, res) {
                res.should.have.status(500)
                res.should.be.json
                res.should.be.a('object')
                done()
            })
    })

    it('Get /selling/today/:id should return object not found of selling history daily', function (done) {
        chai.request(url)
            .get(`/selling/today/${historyId}`)
            .end(function (err, res) {
                 console.log('asdasdasd',res.body);
                
                res.should.have.status(200)
                res.should.be.json
                res.should.be.a('object')
                res.body.should.be.a('object')
                res.body.msg.should.equal('user not found')
                // res.body[0].should.have.property('_id')
                done()
            })
    })

    it('Get /selling/today/:id should return object of selling history daily', function (done) {
        chai.request(url)
            .get(`/selling/today/${idTelegram}`)
            .send({
                userId:userId
            })
            .end(function (err, res) {
                res.should.have.status(200)
                res.should.be.json
                res.should.be.a('object')
                res.body.should.be.a('object')
                res.body.msg.should.equal('data found')
                res.body.should.have.property('result')
                done()
            })
    })

    
})
