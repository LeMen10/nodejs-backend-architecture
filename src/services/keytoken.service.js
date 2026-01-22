'use strict';

const tokenModel = require('../models/token.model');
const {Types} = require('mongoose');

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

    static findByUserId = async (userId) => {
        return await tokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
    }

    static removeKeyById = async (id) => {
        // return await tokenModel.remove({ id });
        return await tokenModel.deleteOne({ _id: new Types.ObjectId(id) });
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await tokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
    }

    static findByRefreshToken = async (refreshToken) => {
        return await tokenModel.findOne({  refreshToken });
    }

    static deleteKeyById = async (userId) => {
        return await tokenModel.deleteOne({ user: new Types.ObjectId(userId) });
    }
}

module.exports = KeyTokenService;
