var express = require('express');
var router = express.Router();
var db = require('../../helper/db');
var multer = require('multer');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var _ = require('underscore');


router.get('/list', function (request, response, next) {
    let filterData = {
        username: request.query.username,
        groupFileList: request.query.groupFileList
    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.ZONKAN, filterData, request.query.offset, request.query.length).then((zonkan) => {
        response.status(200).json(zonkan);
    }).catch(() => {
        response.status(409).send("Zonkan not found");
    });
});

router.post('/edit', function (request, response, next) {
    let query = {
        username: request.body.username
    };
    let newValuesObject = {
        username: request.body.username,
        groupFileList: request.body.groupFileList,
    };
    Object.keys(newValuesObject).forEach(key => newValuesObject[key] === undefined && delete newValuesObject[key]);
    let newValues = {
        $set: newValuesObject
    };
    db.update(db.COLLECTIONS.ZONKAN, query, newValues, { upsert: true }).then((zonkan) => {
        response.status(200).json(zonkan);
    }).catch(() => {
        response.status(409).send("Zonkan not found");
    });
});

module.exports = router;
