require('dotenv').config()
process.env.NODE_ENV = 'test'
const server = require('../bin/www');
const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const Fcm = require('../models/fcm');
chai.should()
chai.use(chaiHttp)

let url = "http://localhost:3000"

describe('Fcm', function () {
    this.timeout(500000)
    beforeEach((done) => {
        mongoose.connect(process.env.MONGO_URI_TEST, { useNewUrlParser: true }).then(function () {
            Fcm.create({
                token: 'sdoia1231283902890dsakdadakd1293dklasjdad'
            })
                .then((result) => {
                    done()
                })
                .catch((err) => {
                    done()
                });

        })
    })

    afterEach((done) => {
        Fcm.collection.drop()
            .then(() => {
                done()
            }).catch(() => {
                done()
            });
    })

    it('POST /fcm/create should success register new token fcm', function (done) {
        chai.request(url)
            .post('/fcm/create')
            .send({
                token: 'sj189239sdakdjadl901230dkajdlakdajdlj1290312kld'
            })
            .end(function (err, res) {
                res.should.have.status(200)
                res.should.be.json;
                res.body.should.be.a('object')
                res.body.msg.should.equal('successfully save token')
                done()
            })
    })

    it('POST /fcm/create should unable register same token', function (done) {
        chai.request(url)
            .post('/fcm/create')
            .send({
                token: 'sdoia1231283902890dsakdadakd1293dklasjdad'
            })
            .end(function (err, res) {
                res.should.have.status(200)
                res.should.be.json;
                res.body.should.be.a('object')
                res.body.msg.should.equal('already recorded')
                done()
            })
    })

    it('POST /fcm/create should handle error register token', function (done) {
        chai.request(url)
            .post('/fcm/create')
            .send({
                to: 123123
            })
            .end(function (err, res) {
                res.should.have.status(400)
                done()
            })
    })

    it('POST /items should able remove token', function (done) {
        chai.request(url)
            .post('/fcm/remove')
            .send({
                token: 'sdoia1231283902890dsakdadakd1293dklasjdad'
            })
            .end(function (err, res) {
                res.should.have.status(200)
                res.should.be.json;
                res.body.should.be.a('object')
                res.body.msg.should.equal('success delete')
                done()
            })
    })

    it('POST /items should unable remove not exist token', function (done) {
        chai.request(url)
            .post('/fcm/remove')
            .send({
                token: 'aosdjkasdjo12309123kjsdadklaisdjoad'
            })
            .end(function (err, res) {
                res.should.have.status(400)
                res.should.be.json;
                res.body.should.be.a('object')
                res.body.msg.should.equal('not found')
                done()
            })
    })
})