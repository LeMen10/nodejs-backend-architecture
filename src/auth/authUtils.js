'use strict';

const JWT = require('jsonwebtoken');
const { NotFoundError, AuthFailureError } = require('../core/error.response');
const { asyncHandler } = require('../helpers/asyncHandler');
const { HEADER } = require('./checkAuth');
const { findByUserId } = require('../services/keytoken.service');

// v0
// const createTokenPair = async (payload, publicKey, privateKey) => {
//     try {
//         // accessToken
//         const accessToken = await JWT.sign(payload, privateKey, {
//             algorithm: 'RS256',
//             expiresIn: '2 days',
//         });

//         const refreshToken = await JWT.sign(payload, privateKey, {
//             algorithm: 'RS256',
//             expiresIn: '7 days',
//         });

//         // verify token check
//         JWT.verify(accessToken, publicKey, (err, decode) => {
//             if (err) {
//                 console.error(`error verify::`, err);
//             } else {
//                 console.log(`decode verify::`, decode);
//             }
//         });

//         return { accessToken, refreshToken };
//     } catch (error) {
//         // Có thể bổ sung return error hoặc throw error tại đây
//     }
// };

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days',
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
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
    /*
        1 - Check userId missing???
        2 - get accessToken
        3 - verifyToken
        4 - check user in bds?
        5 - check keyStore with this userId?
        6 - OK all => return next()
    */

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid Request');

    // 2
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new AuthFailureError('Invalid session or not authenticated');

    // 3
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid Request');

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid Userid');
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error;
    }
});

module.exports = {
    createTokenPair,
    authentication,
};
