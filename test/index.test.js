const chai = require('chai')
const chaiHttp = require('chai-http')
chai.should()
chai.use(chaiHttp)

let url = 'http://localhost:3000'

describe('Index', () => {
  it('GET / should return message', done => {
    chai.request(url)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200)
          res.should.be.json;
          res.body.should.be.a('object')
          done()
        })
  })
})