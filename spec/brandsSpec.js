const request = require('supertest');

describe('Brands', () => {
    let app;
    let toDelete = [];
    beforeEach(() => {
        app = require('../app.js');
    });
    afterEach(() => {
        app.close();
    });


    it('creates a new brand', done => {
        request(app)
            .post('/brands')
            .send({ name: 'TestBrand' })
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.name).toEqual('TestBrand');
                toDelete.push(res.body.id)
                console.log(toDelete)
                done(res);
            });
    });

    it('gets all brands', done => {
        request(app)
            .get('/brands')
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.length).toBeGreaterThan(0);
                done(res);
            });
    });

    it('gets a single brand', done => {
        request(app)
            .get('/brands/'+ toDelete[0]) // admittedly, this is an ugly id.
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body).not.toBeNull();
                done(res);
            });
    });

    it('creates a new brands with all required fields', done => {
        request(app)
            .post('/brands')
            .send({ name: 'EverythingTestBrand', email: 'email@email.com', phone_number: '123',
             city: 'New York', state: 'NY' })
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.name).toEqual('EverythingTestBrand');
                toDelete.push(res.body.id)
                done(res);
            });
    });

    it('posting to brands sets company type to brand', done => {
        request(app)
            .post('/brands')
            .send({ name: 'CompTypeTestBrand', email: 'email@email.com', phone_number: '123',
             city: 'New York', state: 'NY' })
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.company_type).toEqual('brand');
                toDelete.push(res.body.id)
                done(res);
            });
    });

    it('finds an existing brand', done => {
        request(app)
            .get('/brands/search?q=TestBrand')
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body).not.toBeNull();
                done(res);
            });
    });

    it('returns 404 when it can\'t find a brand', done => {
        request(app)
            .get('/brands/search?q=foo bar')
            .expect(404)
            .end((err, res) => {
                if (err) return done.fail(err);
                done(res);
            });
    });

    it('deletes created brands', done => {
      toDelete.forEach(id => {
        request(app)
          .del(`/brands/${id}`)
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
