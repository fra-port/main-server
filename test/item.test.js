require('dotenv').config()
process.env.NODE_ENV = 'test'
const server = require('../bin/www');
const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const Item = require('../models/item');
chai.should()
chai.use(chaiHttp)
let url = "http://localhost:3000"
let idItem = ""

describe('Item', function () {
    this.timeout(500000)
    beforeEach((done) => {
        mongoose.connect(process.env.MONGO_URI_TEST, { useNewUrlParser: true }).then(function () {
            Item.create({
                itemName: 'Ceker Kanan',
                price: 5000
            })
                .then((result) => {
                    idItem = result._id
                    done()
                })
                .catch((err) => {
                    done()
                });

        })
    })

    afterEach((done) => {
        Item.collection.drop()
            .then(() => {
                done()
            }).catch(() => {
                done()
            });
    })

    it('POST /items should success create a new item', function (done) {
        chai.request(url)
            .post('/items')
            .send({
                itemName: 'Ceker Kiri',
                price: 5000
            })
            .end(function (err, res) {
                res.should.have.status(201)
                res.should.be.json;
                res.body.should.be.a('object')
                res.body.msg.should.equal('create item succes')
                res.body.result.should.be.a('object')
                res.body.result.should.have.property('itemName')
                res.body.result.should.have.property('price')
                res.body.result.itemName.should.equal('Ceker Kiri')
                res.body.result.price.should.equal(5000)
                done()
            })
    })

    it('POST /items should failed create a new item', function (done) {
        chai.request(url)
            .post('/items')
            .send({
                item: 'Ceker Kiri',
                prie: 5000
            })
            .end(function (err, res) {
                res.should.have.status(400)
                res.should.be.json;
                res.body.should.be.a('object')
                res.body.should.have.property('msg')
                done()
            })
    })


    it('GET /items should success get all item', function (done) {
        chai.request(url)
        .get('/items')
        .end(function (err, res) {
            res.should.have.status(200)
            res.should.be.json;
            res.body.should.be.a('object')
            res.body.should.have.property('msg')
            res.body.should.have.property('result')
            res.body.msg.should.equal('data found')
            res.body.result.should.have.lengthOf(1)
            done()
        })
    })

    it('GET /items/:id should return one item by id',function (done) {
        chai.request(url)
        .get(`/items/${idItem}`)
        .end(function (err, res) {
            res.should.have.status(200)
            res.should.be.json;
            res.body.should.be.a('object')
            res.body.should.have.property('msg')
            res.body.should.have.property('result')
            res.body.msg.should.equal('data found')
            done()
        })
    })

    it('GET /items/:id should error to get one item by id',function (done) {
        chai.request(url)
        .get(`/items/qwe12342rf.tw824`)
        .end(function (err, res) {
            res.should.have.status(500)
            res.should.be.json;
            res.body.should.be.a('object')
            res.body.should.have.property('msg')
            done()
        })
    })

    it('GET /items/:id should error to get one item by id',function (done) {
        chai.request(url)
        .get(`/items/5bc8177ee7bda1373b9ba123`)
        .end(function (err, res) {
            res.should.have.status(200)
            res.should.be.json;
            res.body.should.be.a('object')
            res.body.should.have.property('msg')
            res.body.msg.should.equal('data not found')
            done()
        })
    })

    it('PUT /items/:id should success update item by id', function (done) {
        chai.request(url)
        .put(`/items/${idItem}`)
        .send({
            itemName: 'Leher',
            price: 4000
        })
        .end(function (err, res) {
            res.should.have.status(201)
            res.should.be.json;
            res.body.should.be.a('object')
            res.body.should.have.property('msg')
            res.body.msg.should.equal('update success')
            done()
        })
    })

    it('PUT /items/:id should failed update item by id', function (done) {
        chai.request(url)
        .put(`/items/k00bad76333y889`)
        .send({
            itemName: 'Leher',
            price: 4000
        })
        .end(function (err, res) {
            res.should.have.status(500)
            res.should.be.json;
            res.body.should.be.a('object')
            res.body.should.have.property('msg')
            done()
        })
    })

    it('DELETE /items/:id should success delete one item by id', function(done) {
        chai.request(url)
        .delete(`/items/${idItem}`)
        .end(function (err, res) {
            res.should.have.status(200)
            res.should.be.json;
            res.body.should.be.a('object')
            res.body.should.have.property('msg')
            res.body.should.have.property('result')
            res.body.msg.should.equal('delete success')
            done()
        })
    })

    it('DELETE /items/:id should success delete one item by id', function(done) {
        chai.request(url)
        .delete(`/items/ui8765abavk`)
        .end(function (err, res) {
            res.should.have.status(500)
            res.should.be.json;
            res.body.should.be.a('object')
            res.body.should.have.property('msg')
            done()
        })
    })
})