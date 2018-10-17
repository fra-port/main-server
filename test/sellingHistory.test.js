const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const sellingHistory = require('../models/sellingHistory')
const User = require('../models/user')
require('dotenv').config()
chai.should()
chai.use(chaiHttp)
let url = "http://localhost:3000"
let historyId = ""
let userId = ""

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
                    if(result){
                        
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
                            .then(function (result) {
                                // console.log('oooo',result);
    
                                historyId = result._id
                                done()
                            })
                            .catch(function (err) {
                                done()
                            })

                    }

                    done()
                })
                .catch(function (err) {
                    done()
                })

        })
    })

    afterEach((done) => {

        User.collection.drop()
            .then(function () {
                // console.log("drop User collection");
                done()
            })
            .catch(function () {
                done()
            })

        sellingHistory.collection.drop()
            .then(function () {
                // console.log("drop User collection");
                done()
            })
            .catch(function () {

            })
    })

    it('POST  /selling should success create a selling history', function (done) {
        chai.request(url)
            .post('/selling')
            .send({
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
            .end(function (err, res) {
                res.should.have.status(200)
                res.should.be.json;
                res.body.should.be.a('object')
                res.body.msg.should.equal('create selling success')
                res.body.data.should.be.a('object')
                res.body.data.should.have.property('userId')
                res.body.data.should.have.property('selling')
                res.body.data.should.have.property('createdAt')
                res.body.data.should.have.property('updatedAt')
                res.body.data.userId.should.equal(userId)
                res.body.data.selling.should.equal([{
                    itemName: "dada",
                    quantity: 1,
                    Total: 10000
                }, {
                    itemName: "paha",
                    quantity: 2,
                    total: 15000
                }])
                done()
            })
    })

    // it('POST /users should unable register using existed email or id telegram', function (done) {
    //     chai.request(url)
    //         .post('/users')
    //         .send({
    //             firstName: "made",
    //             lastName: "sumarsana",
    //             email: "made.sumarsana@gmail.com",
    //             address: "tanah kusir",
    //             phoneNumber: "08123457823",
    //             idTelegram: "1234",
    //             propicURL: "http://newbabywallpapers.in/image/baby-image-photo-and-wallpaper/baby-image-photo-and-wallpaper-12.jpg"
    //         })
    //         .end(function (err, res) {
    //             res.should.have.status(201)
    //             res.should.be.json
    //             res.body.should.be.a('object')
    //             res.body.msg.should.equal('telegram Id or email already exist, please choose another telegram Id or email')
    //             done()
    //         })
    // })

    it('Get /selling should return array of selling history', function (done) {
        chai.request(url)
            .get('/selling')
            .end(function (err, res) {
                res.should.have.status(200)
                res.should.be.json
                res.should.be.a('object')
                res.body.msg.should.equal("data found")
                done()
            })
    })

    it('Get /selling/:id should return selling history by id', function (done) {
        chai.request(url)
            .get(`/selling/${historyId}`)
            .end(function (err, res) {
                res.should.have.status(200)
                res.should.be.json
                res.should.be.a('object')
                res.body.msg.should.equal("successfully get user")
                res.body.data.should.have.property('userId')
                res.body.data.should.have.property('selling')
                res.body.data.userId.should.equal(userId)
                res.body.data.selling.should.equal([{
                    itemName: "dada",
                    quantity: 1,
                    Total: 10000
                }, {
                    itemName: "paha",
                    quantity: 2,
                    total: 15000
                }])
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

    it('DELETE /selling/:id should able delete user', function (done) {
        chai.request(url)
            .delete(`/selling/${userId}`)
            .end(function (err, res) {
                res.should.have.status(200)
                res.should.be.json
                res.should.be.a('object')
                res.body.message.should.equal("delete succes")
                done()
            })
    })
})
