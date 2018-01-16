const express = require('express');
const brandStore = require('json-fs-store')('store/companies');
const router = express.Router();
const uuid = require('uuid/v1');

router.get('/', (req, res) => {
    brandStore.list((err, brands) => {
        if (err) throw err;
        brands = brands.filter(object => object.company_type === 'brand')
        res.json(brands);
    });
});

router.get('/search', (req, res) => {
    const searchQuery = req.query.q;
    brandStore.list((err, objects) => {
      if (err) throw err;
      let found = objects.filter(object => object.name === searchQuery && object.company_type === 'brand')
      if(found.length){
        res.json(found[0])
      } else {
        res.status(404)
            .statusText('Not Found')
      }
    })
});

router.get('/:id', (req, res) => {
    brandStore.load(req.params.id, (err, brand) => {
        if (err) throw err;
        res.json(brand);
    });
});

router.post('/', (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const { name, email, phone_number, city, state } = req.body
    const id = uuid();
    const newBrand = { id, name, email, phone_number, city, state, company_type: 'brand' };
    brandStore.add(newBrand, err => {
        if (err) throw err;
        res.json(newBrand);
    });
});

router.delete('/:id', (req, res)=> {
  if (!req.body) return res.sendStatus(400);
  brandStore.remove(req.params.id, (err) => {
    if (err) throw err;
    res.json('Deleted ' + req.params.id);
  });
});

module.exports = router;
