const router = require('express').Router()
const { createItem,
        getItem,
        getOneItem,
        updateItem,
        deleteItem, } = require('../controllers/item');

router.get('/', getItem)
      .get('/:id', getOneItem)
      .post('/', createItem)
      .put('/:id', updateItem)
      .delete('/:id', deleteItem)

module.exports = router