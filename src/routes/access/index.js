const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const router = express.Router();

router.post('/shop/signup', asyncHandler(accessController.signUp));

// router.post('/', (req, res, next) => {
//     // const strCompress = 'hello';
//     return res.status(200).json({
//         message: 'Welcome Fan tip js!!',
//         // metadata: strCompress.repeat(10000),
//     });
// });

module.exports = router;
