var express = require('express');
var router = express.Router();
var db = require('../../helper/db');
const fs = require('fs');

router.get('/list', function (request, response, next) {
    let filterData = {
        deviceId: request.query.deviceId,
        isActiveDevice: request.query.isActiveDevice,
        isMasterDevice: request.query.isMasterDevice
    };

    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.DEVICES, filterData).then((devices) => {
        response.status(200).json(devices);
    }).catch(() => {
        response.status(409).send("device not found");
    });
});


router.post('/insert', function (request, response, next) {
    let dataObject = {
        deviceId: request.body.deviceId,
        isActiveDevice: request.body.isActiveDevice,
        isMasterDevice: request.body.isMasterDevice
    };

    if (dataObject.deviceId) {
        Object.keys(dataObject).forEach(key => dataObject[key] === undefined && delete dataObject[key]);
        db.find(db.COLLECTIONS.DEVICES, {deviceId: request.body.deviceId}).then((devices) => {
            if (devices === null || devices === undefined || devices.length === 0) {
                db.insert(db.COLLECTIONS.DEVICES, dataObject).then(() => {
                    response.status(200).json();
                }).catch(() => {
                    response.status(409).send("device did not added");
                });
            } else {
                let newValues = {
                    $set: {
                        isMasterDevice: dataObject.isMasterDevice,
                        isActiveDevice: dataObject.isActiveDevice
                    }
                };
                db.update(db.COLLECTIONS.DEVICES, {deviceId: dataObject.deviceId} , newValues ).then((configs) => {
                    response.status(200).json(devices[0].deviceCode);
                }).catch(() => {
                    response.status(409).send("device did not added");
                });
            }
        }).catch(() => {
            db.insert(db.COLLECTIONS.DEVICES, dataObject).then(() => {
                response.status(200).json();
            }).catch(() => {
                response.status(409).send("device did not added");
            });
        });
    } else {
        response.status(409).send("device id not found");
    }
});

router.post('/delete', function (request, response, next) {
    let query = {
        deviceId: request.body.deviceId,
    };
    db.deleteFunction(db.COLLECTIONS.DEVICES, query).then((devices) => {
        response.status(200).json(devices);
    }).catch(() => {
        response.status(409).send("device not found");
    });
});

module.exports = router;
