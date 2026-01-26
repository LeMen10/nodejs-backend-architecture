'use strict';

const jwt = require('jsonwebtoken');
const KeyTokenService = require('../services/keytoken.service');
const { AuthFailureError } = require('../core/error.response');

const refreshTokenAuth = async (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AuthFailureError('Missing refresh token');

    // decode token
    const decoded = jwt.decode(refreshToken);
    if (!decoded?.userId) throw new AuthFailureError('Invalid refresh token');

    // lấy keyStore
    const keyStore = await KeyTokenService.findByUserId(decoded.userId);
    if (!keyStore) throw new AuthFailureError('Not found keyStore');

    // verify refresh token = PRIVATE KEY
    jwt.verify(refreshToken, keyStore.privateKey);

    req.user = decoded; // { userId, email }
    req.keyStore = keyStore;

    next();
};

module.exports = refreshTokenAuth;
