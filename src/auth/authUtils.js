'use strict';

const JWT = require('jsonwebtoken');
const { NotFoundError, AuthFailureError } = require('../core/error.response');
const { asyncHandler } = require('../helpers/asyncHandler');
const { HEADER } = require('./checkAuth');
const { findByUserId } = require('../services/keytoken.service');

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // accessToken
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days',
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days',
        });

        // verify token check
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify::`, err);
            } else {
                console.log(`decode verify::`, decode);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        // Có thể bổ sung return error hoặc throw error tại đây
    }
};

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid Request');

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Missing Access Token');

    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new AuthFailureError('Invalid session');

    const decodeUser = JWT.verify(accessToken, keyStore.publicKey, {
        algorithms: ['RS256'],
    });

    if (decodeUser.userId !== userId) {
        throw new AuthFailureError('Invalid UserId');
    }

    req.user = decodeUser;
    req.keyStore = keyStore;
    next();
});

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
};

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
};
