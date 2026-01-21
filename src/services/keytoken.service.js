'use strict';

const tokenModel = require('../models/token.model');

class KeyTokenService {
    // static createKeyToken = async ({ userId, publicKey }) => {
    //     try {
    //         const publicKeyString = publicKey.toString();
    //         const tokens = await tokenModel.create({
    //             user: userId,
    //             publicKey: publicKeyString,
    //         });

    //         return tokens ? tokens.publicKey : null;
    //     } catch (error) {
    //         return error;
    //     }
    // };

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // level 0
            // const tokens = await tokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // return tokens ? tokens.publicKey : null

            // level xxx
            const filter = { user: userId },
                update = {
                    publicKey,
                    privateKey,
                    refreshTokensUsed: [],
                    refreshToken,
                },
                options = { upsert: true, new: true };

            const tokens = await tokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };
}

module.exports = KeyTokenService;
