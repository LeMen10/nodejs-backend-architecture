'use strict';

const AccessService = require('../services/access.service');
const { CREATED, OK, SuccessResponse } = require('../core/success.response');

class AccessController {
    logout = async (req, res, next) => {
        console.log('logout req.keyStore::', req.keyStore);
        new SuccessResponse({
            message: 'Logout OK!',
            metadata: await AccessService.logout(req.keyStore),
        }).send(res);
    };

    login = async (req, res, next) => {
        new CREATED({
            message: 'Login OK!',
            metadata: await AccessService.login(req.body),
        }).send(res);
    };

    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered OK!',
            metadata: await AccessService.signUp(req.body),
        }).send(res);
        // return res.status(201).json(await AccessService.signUp(req.body));
    };
}

module.exports = new AccessController();
