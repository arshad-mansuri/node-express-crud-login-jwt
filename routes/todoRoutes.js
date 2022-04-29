const express = require('express');

const router = express.Router();

const todoController = require('../controllers/TodoController');

router.get('/',todoController.findAll);

router.post('/create',todoController.create);

router.patch('/update',todoController.update);

router.delete('/delete',todoController.delete);

router.delete('/delete-all',todoController.deleteAll);


module.exports = router;