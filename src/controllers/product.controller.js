'use strict';

const ProductService = require('../services/product.service');
const { CREATED, OK, SuccessResponse } = require('../core/success.response');

class ProductController {

    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create Product Success!',
            metadata: await ProductService.createProduct( req.body.product_type, req.body),
        }).send(res);
    };

}

module.exports = new ProductController();
