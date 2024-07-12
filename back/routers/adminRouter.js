// adminRouter.js
const express = require('express');
const { fetchUsers, changeUserProps,deleteUser } = require('../controllers/adminController');

const router = express.Router();

router.get('/users', fetchUsers);
router.put('/users', changeUserProps);
router.delete('/delete/:id',deleteUser);

module.exports = router;
