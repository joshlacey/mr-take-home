const express = require('express');
const factoryStore = require('json-fs-store')('store/companies');
const router = express.Router();
const uuid = require('uuid/v1');

router.get('/', (req, res) => {
    factoryStore.list((err, factories) => {
        if (err) throw err;
        factories = factories.filter(object => object.company_type === 'factory')
        res.json(factories);
    });
});

router.get('/search', (req, res) => {
    const searchQuery = req.query.q;
    factoryStore.list((err, objects) => {
      if (err) throw err;
      let found = objects.filter(object => object.name === searchQuery && object.company_type === 'factory')
      if(found.length){
        res.json(found[0])
      } else {
        res.status(404)
           .send("Not Found")
      }
    })
});

router.get('/:id', (req, res) => {
    factoryStore.load(req.params.id, (err, factory) => {
        if (err) throw err;
        res.json(factory);
    });
});

router.post('/', (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const { name, email, phone_number, city, state } = req.body
    const id = uuid();
    const newFactory = { id, name, email, phone_number, city, state, company_type: 'factory' };
    factoryStore.add(newFactory, err => {
        if (err) throw err;
        res.json(newFactory);
    });
});

router.delete('/:id', (req, res)=> {
  if (!req.body) return res.sendStatus(400);
  factoryStore.remove(req.params.id, (err) => {
    if (err) throw err;
    res.json('Deleted ' + req.params.id);
  });
});

module.exports = router;
