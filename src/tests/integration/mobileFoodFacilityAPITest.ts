import {server} from '../../app'
import chai from 'chai'
import chaiHttp from 'chai-http'
import assert from 'assert'

let should = chai.should()
chai.use(chaiHttp)

describe('API', function () {
    it('GET mobile food trucks', function (done) {
        chai.request(server)
            .get('/food-truck')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.results.length.should.be.eql(10)
                done()
            })
    })

    it('GET mobile food truck', function (done) {
        chai.request(server)
            .get('/food-truck/1514023')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                done()
            })
    })

    it('POST valid body should 201 success', function (done) {
        chai.request(server)
            .post('/food-truck')
            .type('application/json')
            .send({
                'facilityType': 'truck',
                'applicant': 'Alex'
            })
            .end((err, res) => {
                res.should.have.status(201)
                done()
            })
    })

    it('POST invalid body should return 400 error', function (done) {
        chai.request(server)
            .post('/food-truck')
            .type('application/json')
            .send({
                'applicant': 'John'
            })
            .end((err, res) => {
                res.should.have.status(400)
                assert.deepEqual(res.body, {
                    status: 400,
                    userMessage: [{
                        location: 'body',
                        msg: 'facilityType is required',
                        param: 'facilityType'
                    }]
                })
                done()
            })
    })
})