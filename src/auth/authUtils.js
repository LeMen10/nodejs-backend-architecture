'use strict';

const JWT = require('jsonwebtoken');

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

module.exports = {
    createTokenPair,
};
