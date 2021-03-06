const request = require('supertest');

describe('Factories', () => {
    let app;
    let toDelete = [];
    beforeEach(() => {
        app = require('../app.js');
    });
    afterEach(() => {
        app.close();
    });

    it('creates a new factory', done => {
        request(app)
            .post('/factories')
            .send({ name: 'TestFactory' })
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.name).toEqual('TestFactory');
                toDelete.push(res.body.id);
                done(res);
            });
    });

    it('gets all factories', done => {
        request(app)
            .get('/factories')
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.length).toBeGreaterThan(0);
                done(res);
            });
    });

    it('gets a single factory', done => {
        request(app)
            .get('/factories/' + toDelete[0]) // admittedly, this is an ugly id.
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body).not.toBeNull();
                done(res);
            });
    });

    it('creates a new factory with all required fields', done => {
        request(app)
            .post('/factories')
            .send({ name: 'EverythingTestFactory', email: 'email@email.com', phone_number: '123',
             city: 'New York', state: 'NY' })
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.name).toEqual('EverythingTestFactory');
                toDelete.push(res.body.id);
                done(res);
            });
    });

    it('posting to factories sets company type to factory', done => {
        request(app)
            .post('/factories')
            .send({ name: 'CompTypeTestFactory', email: 'email@email.com', phone_number: '123',
             city: 'New York', state: 'NY' })
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.company_type).toEqual('factory');
                toDelete.push(res.body.id);
                done(res);
            });
    });

    it('finds an existing factory', done => {
        request(app)
            .get('/factories/search?q=TestFactory')
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body).not.toBeNull();
                done(res);
            });
    });

    it('returns 404 when it can\'t find a factory', done => {
        request(app)
            .get('/factories/search?q=foo bar')
            .expect(404)
            .end((err, res) => {
                if (err) return done.fail(err);
                done(res);
            });
    });

    it('deletes created factories', done => {
      toDelete.forEach(id => {
        request(app)
          .del(`/factories/${id}`)
          .expect(200)
          .end((err, res) => {
            if(err) return done.fail(err);
            if (res.body === `Deleted ${toDelete[2]}`){
              done();
            }
          })
      })
    });
});
