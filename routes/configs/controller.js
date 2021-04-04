var express = require('express');
var router = express.Router();
var db = require('../../helper/db');

const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 512});

router.get('/list', function(request, response, next) {
    let filterData = {
        configId:0,
        realStateName:request.query.realStateName ,
        apartment:request.query.apartment ,
        vila: request.query.vila,
        building: request.query.building,
        oldHouse: request.query.oldHouse,
        office: request.query.office,
        equipments: request.query.equipments,
        documentKind: request.query.documentKind,
        source: request.query.source,
        frontKind: request.query.frontKind,
        region: request.query.region,
        type: request.query.type,
        moshakhase: request.query.moshakhase,
        publisher: request.query.publisher,
        pool: request.query.pool,
        sona: request.query.sona,
        jakozi: request.query.jakozi,
    };

    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.CONFIGS, {}).then((files) => {
        response.status(200).json(files);
    }).catch(() => {
        response.status(409).send("file not found");
    });
});

router.post('/insert', function(request, response, next) {
    let dataObject = {
        configId:0,
        realStateName:request.body.realStateName ,
        apartment:request.body.apartment ,
        vila: request.body.vila,
        building: request.body.building,
        oldHouse: request.body.oldHouse,
        office: request.body.office,
        equipments: request.body.equipments,
        documentKind: request.body.documentKind,
        source: request.body.source,
        frontKind: request.body.frontKind,
        region: request.body.region,
        type: request.body.type,
        moshakhase: request.body.moshakhase,
        publisher: request.body.publisher,
        pool: request.body.pool,
        sona: request.body.sona,
        jakozi: request.body.jakozi,
    };

    Object.keys(dataObject).forEach(key => dataObject[key] === undefined && delete dataObject[key]);
    db.find(db.COLLECTIONS.CONFIGS, {}).then((configs) => {
        if (configs === null || configs === undefined || configs.length === 0) {
            db.insert(db.COLLECTIONS.CONFIGS, dataObject).then(() => {
                response.status(200).json(dataObject);
            }).catch(() => {
                response.status(409).send("config did not added");
            });
        } else {
            let newValues = {
                $set: {
                    realStateName:request.body.realStateName ? request.body.realStateName : configs[0].realStateName,
                    apartment:request.body.apartment ? request.body.apartment : configs[0].apartment ,
                    vila:request.body.vila ? request.body.vila : configs[0].vila ,
                    building:request.body.building ? request.body.building : configs[0].building ,
                    oldHouse:request.body.oldHouse ? request.body.oldHouse : configs[0].oldHouse ,
                    office:request.body.office ? request.body.office : configs[0].office ,
                    equipments:request.body.equipments ? request.body.equipments : configs[0].equipments ,
                    documentKind:request.body.documentKind ? request.body.documentKind : configs[0].documentKind ,
                    source:request.body.source ? request.body.source : configs[0].source ,
                    frontKind:request.body.frontKind ? request.body.frontKind : configs[0].frontKind ,
                    region:request.body.region ? request.body.region : configs[0].region ,
                    type:request.body.type ? request.body.type : configs[0].type ,
                    moshakhase:request.body.moshakhase ? request.body.moshakhase : configs[0].moshakhase ,
                    publisher:request.body.publisher ? request.body.publisher : configs[0].publisher ,
                    pool:request.body.pool ? request.body.pool : configs[0].pool ,
                    sona:request.body.sona ? request.body.sona : configs[0].sona ,
                    jakozi:request.body.jakozi ? request.body.jakozi : configs[0].jakozi
                }
            };
            db.update(db.COLLECTIONS.CONFIGS, {configId: 0} , newValues ).then((configs) => {
                response.status(200).json(configs);
            }).catch(() => {
                response.status(409).send("configs not found");
            });
        }
    }).catch(() => {
        db.insert(db.COLLECTIONS.CONFIGS, dataObject).then(() => {
            response.status(200).json();
        }).catch(() => {
            response.status(409).send("config did not added");
        });
    });
});

router.post('/delete', function(request, response, next) {

    let query = {
        configId: 0,
    };

    db.deleteFunction(db.COLLECTIONS.CONFIGS, query).then((configs) => {
        response.status(200).json(configs);
    }).catch(() => {
        response.status(409).send("config not found");
    });
});

module.exports = router;
