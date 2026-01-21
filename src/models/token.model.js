'use strict';

const mongoose = require('mongoose'); // Erase if already required
const { model, Schema, Types } = require('mongoose');

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Shop',
        },
        publicKey: {
            type: String,
            required: true,
        },
        privateKey: {
            type: String,
            required: true,
        },
        refreshTokensUsed: {
            type: Array,
            default: [],
            // nhung 1 token da dc sd
        },
        refreshToken: {
            type: String,
            required: true,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    },
);

// Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
