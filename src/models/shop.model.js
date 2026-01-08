'use strict';

// !dmbg
// const mongoose = require('mongoose'); // Erase if already required

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

// Khai báo Schema cho Mongo model
const shopSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            maxLength: 150,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'inactive',
        },
        verify: {
            type: Schema.Types.Boolean,
            default: false,
        },
        roles: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = model(DOCUMENT_NAME, shopSchema);
