'use strict';

const _ = require('lodash');

// Hàm lấy các field cụ thể từ một object
const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

module.exports = {
    getInfoData,
};
