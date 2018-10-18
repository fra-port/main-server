require('dotenv').config()
process.env.NODE_ENV = 'test'
const server = require('../bin/www');
const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const Report = require('../models/report')
const User = require('../models/user');
const Selling = require('../models/sellingHistory');
chai.should()
chai.use(chaiHttp)

let url = "http://localhost:3000"
let userId = ""
let sellingId = ""
let reportId = ""

describe('Report', function () {
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
                    let item = [{
                        itemName: "paha",
                        quantity: 5,
                        Total: 6
                    }]

                    Selling.create({
                        userId: userId,
                        selling: item
                    })
                        .then((resultSelling) => {
                            sellingId = resultSelling._id
                            totalSelling = 6
                            Report.create({
                                total: totalSelling,
                                sellingId: sellingId
                            })
                                .then((resultReport) => {
                                    reportId = resultReport._id
                                    done()
                                })
                                .catch((err) => {
                                    done()
                                });

                        })
                        .catch((err) => {
                            done()
                        });
                })
                .catch(function (err) {
                    done()
                })
        })
    })

    afterEach((done) => {
        Report.collection.drop()
            .then(() => {
                Selling.collection.drop()
                    .then(() => {
                        User.collection.drop()
                            .then(() => {
                                done()
                            })
                            .catch(err => {
                                done()
                            })
                    })
                    .catch(err => {
                        done()
                    })
            })
            .catch(err => {
                done()
            })
    })

    it('POST /reports should create new report', function (done) {
        chai.request(url)
            .post('/reports')
            .send({
                sellingId: sellingId
            })
            .end(function (err, res) {
                res.should.have.status(201)
                res.should.be.json;
                res.body.should.be.a('object')
                res.body.msg.should.equal('create succes')
                res.body.result.should.be.a('object')
                res.body.result.should.have.property('total')
                res.body.result.should.have.property('sellingId')
                res.body.result.should.have.property('createdAt')
                res.body.result.should.have.property('updatedAt')
                res.body.result.should.have.property('_id')
                res.body.result.total.should.equal(6)
                done()
            })
    })

    it('POST /reports should return error, data not found', function (done) {
        chai.request(url)
            .post('/reports')
            .send({
                sellingId: userId
            })
            .end(function (err, res) {
                res.should.have.status(400)
                res.should.be.json;
                res.body.should.be.a('object')
                res.body.should.have.property('msg')
                res.body.msg.should.equal('data not found')
                done()
            })
    })

    it('POST /reports should return error, data not found', function (done) {
        chai.request(url)
            .post('/reports')
            .send({
                sellingId: 'lguktdyiiyy'
            })
            .end(function (err, res) {
                res.should.be.json
                res.should.be.a('object')
                res.body.should.have.property('message')
                res.body.should.have.property('name')
                res.body.should.have.property('value')
                res.body.should.have.property('stringValue')
                res.body.should.have.property('path')
                res.error.should.have.property('status')
                res.error.status.should.equal(500)
                done()
            })
    })

    it('GET /reports should return array of report', function(done) {
        chai.request(url)
        .get('/reports')
        .end(function (err, res){
            res.should.have.status(200)
            res.should.be.json
            res.should.be.a('object')
            res.body.should.have.property('msg')
            res.body.should.have.property('result')
            res.body.msg.should.equal('data found')
            done()
        })
    })

    it('GET /reports/:id should return report by id', function(done) {
        chai.request(url)
        .get(`/reports/${reportId}`)
        .end(function (err, res) {
           res.should.have.status(200)
           res.should.be.json
           res.should.be.a('object')
           res.body.should.have.property('msg')
           res.body.should.have.property('result')
           done()
        })
    })

    it('GET /reports/today should return report in specified date', function(done) {
        let date = new Date()
        chai.request(url)
            .get(`/reports/day?date=${date}`)
            .end(function(err, res) {
                res.should.have.status(200)
                res.should.be.json
                res.should.be.a('object')
                res.body.should.have.property('msg')
                res.body.should.have.property('data')
                res.body.data.should.have.property('totalReport')
                res.body.data.should.have.property('totalIncome')
                res.body.data.should.have.property('listItem')
                res.body.data.should.have.property('result')
                done()
            })
    })

    it('GET /reports/today should erroer to return report in specified date', function(done) {
        let date = '2018-date'
        chai.request(url)
            .get(`/reports/day?date=${date}`)
            .end(function(err, res) {
                res.should.be.json
                res.should.be.a('object')
                res.body.should.have.property('msg')
                res.error.status.should.equal(500)
                done()
            })
    })


    it('GET /reports/:id should return report null, data not found', function(done) {
        chai.request(url)
        .get(`/reports/${sellingId}`)
        .end(function (err, res) {
           res.should.have.status(200)
           res.should.be.json
           res.should.be.a('object')
           res.body.should.have.property('msg')
           res.body.msg.should.equal('data not found')
           done()
        })
    })

    it('GET /reports/:id should return error', function(done) {
        chai.request(url)
        .get(`/reports/qqqqqqqqqadav12`)
        .end(function (err, res) {
            res.should.be.json
            res.should.be.a('object')
            res.body.should.have.property('message')
            res.body.should.have.property('name')
            res.body.should.have.property('value')
            res.body.should.have.property('stringValue')
            res.body.should.have.property('path')
            res.error.should.have.property('status')
            res.error.status.should.equal(500)
            done()
        })
    })



    it('DELETE /reports/:id should delete a report by id', function(done) {
        chai.request(url)
        .delete(`/reports/${reportId}`)
        .end(function (err, res) {
            res.should.have.status(200)
            res.should.be.json
            res.should.be.a('object')
            res.body.should.have.property('msg')
            res.body.should.have.property('result')
            done()
        })
    })

    it('DELETE /reports/:id should error when delete by id', function(done) {
        chai.request(url)
        .delete(`/reports/5bc72f2724ece23aa5eb41hh`)
        .end(function (err, res) {
            res.should.be.json
            res.should.be.a('object')
            res.body.should.have.property('message')
            res.body.should.have.property('name')
            res.body.should.have.property('value')
            res.body.should.have.property('stringValue')
            res.body.should.have.property('path')
            res.error.should.have.property('status')
            res.error.status.should.equal(500)
            done()
        })
    })

    it('DELETE /reports/:id should return data not found', function(done) {
        chai.request(url)
        .delete(`/reports/${sellingId}`)
        .end(function (err, res) {
            res.should.have.status(200)
            res.should.be.json
            res.should.be.a('object')
            res.body.should.have.property('msg')
            res.body.msg.should.equal('data not found')
            done()
        })
    })


})