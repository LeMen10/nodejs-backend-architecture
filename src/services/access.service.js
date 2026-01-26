'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keytoken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { type } = require('os');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
};

class AccessService {

    static handlerRefreshToken = async ({ keyStore, user, refreshToken }) => {
        const { userId, email } = user;

        // 1. Check refresh token đã bị dùng chưa
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError('Something wrong happened! Please re-login');
        }

        // 2. Check refresh token hiện tại có khớp không
        if (keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError('Shop not registered');
        }

        // 3. Check user tồn tại
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError('Shop not registered');

        // 4. Tạo token mới (RS256)
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);

        // 5. Update refresh token
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken,
            },
        });

        return {
            user: { userId, email },
            tokens,
        };
    };

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        return delKey;
    };

    /*
        1 - check email in dbs
        2 - match password
        3 - create AT vs RT and save
        4 - generate tokens
        5 - get data return login
    */
    static login = async ({ email, password }) => {
        // 1. Check email
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new BadRequestError('Shop not registered');

        // 2. Check password
        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError('Authentication error');

        // 3. Tạo RSA key pair (RS256)
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
        });

        const { _id: userId } = foundShop;

        // 4. Tạo token
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

        // 5. Lưu key & refresh token
        await KeyTokenService.createKeyToken({
            userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop,
            }),
            tokens,
        };
    };

    static signUp = async ({ name, email, password }) => {
        // step1: check email exists??
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) throw new BadRequestError('Error: Shop already registered');

        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP],
        });

        if (newShop) {
            // created privateKey, publicKey
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                },
            });
            // const privateKey = crypto.randomBytes(64).toString('hex');
            // const publicKey = crypto.randomBytes(64).toString('hex');

            // const publicKeyString = await KeyTokenService.createKeyToken({
            //     userId: newShop._id,
            //     publicKey,
            // });

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
            });

            if (!keyStore) throw new BadRequestError('Error: Shop already registered');

            // console.log(`publicKeyString::`, publicKeyString);
            // const publicKeyObject = crypto.createPublicKey(publicKeyString);

            // console.log(`publicKeyObj::`, publicKeyObject);

            // const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyObject, privateKey);
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
            // console.log('token:', tokens);
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                    tokens,
                },
            };
        }
        return {
            code: 200,
            metadata: null,
        };
    };
}

module.exports = AccessService;
