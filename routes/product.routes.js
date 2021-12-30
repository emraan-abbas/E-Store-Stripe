const express = require('express');
const router = express.Router();

const product = require('../controllers/product.controller');

router.post('/', product.create);
router.get('/', product.findAll);
router.get('/:id', product.findOne);
router.delete('/:id', product.delete);
router.put('/:id', product.update);

module.exports = router;
