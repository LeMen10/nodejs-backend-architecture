'use strict';

const tokenModel = require('../models/token.model');

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            const publicKeyString = publicKey.toString();
            const tokens = await tokenModel.create({
                user: userId,
                publicKey: publicKeyString,
            });

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };
}

module.exports = KeyTokenService;
