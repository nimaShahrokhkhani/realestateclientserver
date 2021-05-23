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
        regionPrice: request.query.regionPrice,
        type: request.query.type,
        moshakhase: request.query.moshakhase,
        publisher: request.query.publisher,
        pool: request.query.pool,
        sona: request.query.sona,
        jakozi: request.query.jakozi,
        wcService: request.query.wcService,
        kitchenService: request.query.kitchenService,
        parking: request.query.parking,
        warehouse: request.query.warehouse,
        modify: request.query.modify,
        yard: request.query.yard,
        backYard: request.query.backYard,
        employeeService: request.query.employeeService,
        basement: request.query.basement,
        patio: request.query.patio,
        residenceOwner: request.query.residenceOwner,
        telephone: request.query.telephone,
        floorCovering: request.query.floorCovering,
        blackList: request.query.blackList,
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
        regionPrice: request.body.regionPrice,
        type: request.body.type,
        moshakhase: request.body.moshakhase,
        publisher: request.body.publisher,
        pool: request.body.pool,
        sona: request.body.sona,
        jakozi: request.body.jakozi,
        wcService: request.body.wcService,
        kitchenService: request.body.kitchenService,
        parking: request.body.parking,
        warehouse: request.body.warehouse,
        modify: request.body.modify,
        yard: request.body.yard,
        backYard: request.body.backYard,
        employeeService: request.body.employeeService,
        basement: request.body.basement,
        patio: request.body.patio,
        residenceOwner: request.body.residenceOwner,
        telephone: request.body.telephone,
        floorCovering: request.body.floorCovering,
        blackList: request.body.blackList,
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
                    realStateName:request.body[0].realStateName ? request.body[0].realStateName : configs[0].realStateName,
                    apartment:request.body[0].apartment ? request.body[0].apartment : configs[0].apartment ,
                    vila:request.body[0].vila ? request.body[0].vila : configs[0].vila ,
                    building:request.body[0].building ? request.body[0].building : configs[0].building ,
                    oldHouse:request.body[0].oldHouse ? request.body[0].oldHouse : configs[0].oldHouse ,
                    office:request.body[0].office ? request.body[0].office : configs[0].office ,
                    equipments:request.body[0].equipments ? request.body[0].equipments : configs[0].equipments ,
                    documentKind:request.body[0].documentKind ? request.body[0].documentKind : configs[0].documentKind ,
                    source:request.body[0].source ? request.body[0].source : configs[0].source ,
                    frontKind:request.body[0].frontKind ? request.body[0].frontKind : configs[0].frontKind ,
                    region:request.body[0].region ? request.body[0].region : configs[0].region ,
                    regionPrice:request.body[0].regionPrice ? request.body[0].regionPrice : configs[0].regionPrice ,
                    type:request.body[0].type ? request.body[0].type : configs[0].type ,
                    moshakhase:request.body[0].moshakhase ? request.body[0].moshakhase : configs[0].moshakhase ,
                    publisher:request.body[0].publisher ? request.body[0].publisher : configs[0].publisher ,
                    pool:request.body[0].pool ? request.body[0].pool : configs[0].pool ,
                    sona:request.body[0].sona ? request.body[0].sona : configs[0].sona ,
                    jakozi:request.body[0].jakozi ? request.body[0].jakozi : configs[0].jakozi,
                    wcService: request.body[0].wcService ? request.body[0].wcService : configs[0].wcService,
                    kitchenService: request.body[0].kitchenService ? request.body[0].kitchenService : configs[0].kitchenService,
                    parking: request.body[0].parking ? request.body[0].parking : configs[0].parking,
                    warehouse: request.body[0].warehouse ? request.body[0].warehouse : configs[0].warehouse,
                    modify: request.body[0].modify ? request.body[0].modify : configs[0].modify,
                    yard: request.body[0].yard ? request.body[0].yard : configs[0].yard,
                    backYard: request.body[0].backYard ? request.body[0].backYard : configs[0].backYard,
                    employeeService: request.body[0].employeeService ? request.body[0].employeeService : configs[0].employeeService,
                    basement: request.body[0].basement ? request.body[0].basement : configs[0].basement,
                    patio: request.body[0].patio ? request.body[0].patio : configs[0].patio,
                    residenceOwner: request.body[0].residenceOwner ? request.body[0].residenceOwner : configs[0].residenceOwner,
                    telephone: request.body[0].telephone ? request.body[0].telephone : configs[0].telephone,
                    floorCovering: request.body[0].floorCovering ? request.body[0].floorCovering : configs[0].floorCovering,
                    blackList:request.body[0].blackList ? request.body[0].blackList : configs[0].blackList
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
