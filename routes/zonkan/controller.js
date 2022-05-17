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
    db.update(db.COLLECTIONS.ZONKAN, query, newValues, {upsert: true}).then((zonkan) => {
        response.status(200).json(zonkan);
    }).catch(() => {
        response.status(409).send("Zonkan not found");
    });
});

function updateZonkan(response, username, groupFileList) {
    let query = {
        username: username
    };
    let newValuesObject = {
        username: username,
        groupFileList: groupFileList,
    };
    Object.keys(newValuesObject).forEach(key => newValuesObject[key] === undefined && delete newValuesObject[key]);
    let newValues = {
        $set: newValuesObject
    };
    db.update(db.COLLECTIONS.ZONKAN, query, newValues, {upsert: true}).then((zonkan) => {
        response.status(200).json(zonkan);
    }).catch(() => {
        response.status(409).send("Zonkan not found");
    });
}

function arrayUnique(array) {
    let a = array.concat();
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i].Id === a[j].Id)
                a.splice(j--, 1);
        }
    }

    return a;
}

router.post('/editV2', function (request, response, next) {
    let filterData = {
        username: request.body.username,
    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.ZONKAN, filterData, request.query.offset, request.query.length).then((zonkan) => {
        let currentZonkan = zonkan[0];
        let fileList = [];
        if (!_.isEmpty(currentZonkan) && !_.isEmpty(currentZonkan.groupFileList) && !_.isEmpty(currentZonkan.groupFileList[request.body.zonkanName])) {
            fileList = currentZonkan.groupFileList[request.body.zonkanName];
        }
        fileList = [...fileList, ...request.body.groupFileList];
        currentZonkan.groupFileList[request.body.zonkanName] = arrayUnique(fileList);
        updateZonkan(response, request.body.username, currentZonkan.groupFileList);
    }).catch(() => {
        let groupFileList = {};
        groupFileList[request.body.zonkanName] = request.body.groupFileList;
        updateZonkan(response, request.body.username, groupFileList);
    });
});

module.exports = router;
