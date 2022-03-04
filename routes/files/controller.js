var _ = require('underscore');
var express = require('express');
var router = express.Router();
var db = require('../../helper/db');
const fs = require('fs');
//encryption
const NodeRSA = require('node-rsa');
var key = new NodeRSA({b: 512});
const loadKey = () => {
    try {
        return fs.readFileSync('./key.json', 'utf8')
    } catch (err) {
        return false
    }
};
if (loadKey()) {
    key.importKey(loadKey());
} else {
    try {
        key.setOptions({encryptionScheme: 'pkcs1'});
        fs.writeFileSync('./key.json', key.exportKey())
    } catch (err) {
        console.error(err)
    }
}

router.get('/totalCount', function(request, response, next) {
    db.getCountOfDocumentV2(db.COLLECTIONS.FILES, {}).then((files) => {
        db.findLastRecord(db.COLLECTIONS.FILES, {}).then(lastFile => {
            if (lastFile && lastFile[0] && lastFile[0].Number) {
                let lastFileNumber = lastFile[0].Number - 10000;
                let finalResult = lastFileNumber > files ? lastFileNumber + 1 : files + 1;
                response.status(200).json(finalResult);
            } else {
                response.status(200).json(1);
            }
        }).catch(error => {
            response.status(408).send("file not found");
        })
    }).catch(() => {
        response.status(409).send("file not found");
    });
});

router.get('/list', function (request, response, next) {
    let filterData = {
        Id: request.query.Id,
        tel1: request.query.tel1,
        tel2: request.query.tel2,
        tel3: request.query.tel3,
        tel4: request.query.tel4,
        tel5: request.query.tel5,
        owner: request.query.owner,
        iranDate: request.query.iranDate,
        date: {
            $gte: parseInt(request.query.fromDate),//greater than or equal query
            $lte: parseInt(request.query.toDate),
        },
        address: !_.isEmpty(request.query.address) ? {$in: request.query.address} : undefined,
        regionCode: !_.isEmpty(request.query.regionCode) ? {$in: request.query.regionCode} : undefined,//contain query
        regionName: !_.isEmpty(request.query.regionName) ? {$in: request.query.regionName} : undefined,
        sale: !_.isEmpty(request.query.sale) ? {$in: request.query.sale} : undefined,
        rent: {
            $gte: parseInt(request.query.fromRent),
            $lte: parseInt(request.query.toRent),
        },
        mortgage: {
            $gte: parseInt(request.query.fromMortgage),
            $lte: parseInt(request.query.toMortgage),
        },
        apartment: request.query.apartment === "true" ? {$exists: true, $ne : ""} : request.query.apartment,
        land: request.query.land === "true" ? {$exists: true, $ne : ""} : request.query.land,
        vila: request.query.vila === "true" ? {$exists: true, $ne : ""} : request.query.vila,
        building: request.query.building === "true" ? {$exists: true, $ne : ""} : request.query.building,
        home: request.query.home,
        oldHouse: request.query.oldHouse === "true" ? {$exists: true, $ne : ""} : request.query.oldHouse,
        office: request.query.office === "true" ? {$exists: true, $ne : ""} : request.query.office,
        store: request.query.store,
        suit: request.query.suit,
        north: request.query.north,
        south: request.query.south,
        east: request.query.east,
        west: request.query.west,
        unitFloor: request.query.unitFloor,
        unitRoom: request.query.unitRoom,
        unitBalcony: request.query.unitBalcony,
        unitTelephone: request.query.unitTelephone,
        unitWC: request.query.unitWC,
        unitFloorCovering: request.query.unitFloorCovering,
        unitParking: request.query.unitParking,
        unitAnbari: request.query.unitAnbari,
        unitKitchen: request.query.unitKitchen,
        unitBuiltUpArea: request.query.unitBuiltUpArea,
        unitOpen: request.query.unitOpen,
        unitMetri: request.query.unitMetri,
        unitTotalAmount: request.query.unitTotalAmount,
        type: request.query.type,
        floorNo: {
            $gte: parseInt(request.query.fromFloorNo),
            $lte: parseInt(request.query.toFloorNo),
        },
        unitNo: {
            $gte: parseInt(request.query.fromUnitNo),
            $lte: parseInt(request.query.toUnitNo),
        },
        totalUnit: request.query.totalUnit,
        unitComment: request.query.unitComment,
        totalPrice: {
            $gte: parseInt(request.query.fromTotalPrice),
            $lte: parseInt(request.query.toTotalPrice),
        },
        unitPrice: {
            $gte: parseInt(request.query.fromUnitPrice),
            $lte: parseInt(request.query.toUnitPrice),
        },
        priceComment: request.query.priceComment,
        pool: request.query.pool,
        sona: request.query.sona,
        jakozi: request.query.jakozi,
        area: {
            $gte: parseInt(request.query.fromArea),
            $lte: parseInt(request.query.toArea),
        },
        density: request.query.density,
        front: {
            $gte: parseInt(request.query.fromFront),
            $lte: parseInt(request.query.toFront),
        },
        height: {
            $gte: parseInt(request.query.fromHeight),
            $lte: parseInt(request.query.toHeight),
        },
        modify: request.query.modify,
        yard: request.query.yard,
        smallYard: request.query.smallYard,
        underGround: request.query.underGround,
        employeeService: request.query.employeeService,
        patio: request.query.patio,
        residential: request.query.residential,
        empty: request.query.empty,
        rented: request.query.rented,
        age: {
            $gte: parseInt(request.query.fromAge),
            $lte: parseInt(request.query.toAge),
        },
        frontKind: request.query.frontKind,
        source: request.query.source,
        publisher: request.query.publisher,
        ownerInHouse: request.query.ownerInHouse,
        documentKind: request.query.documentKind,
        comment: request.query.comment,
        caseKind: request.query.caseKind,
        Number: {
            $gte: parseInt(request.query.fromNumber),
            $lte: parseInt(request.query.toNumber),
        },
        inHurry: request.query.inHurry,
        equipments: !_.isEmpty(request.query.equipments) ? {$in: request.query.equipments} : undefined,
        archive: request.query.archive,
        participation: request.query.participation,
        exchange: request.query.exchange,
        username: request.query.username,
        noOwnerAccess: request.query.noOwnerAccess,
        isDeleted: request.query.isDeleted,
        isSold: request.query.isSold,
        isRented: request.query.isRented,
        isDontCall: request.query.isDontCall,
    };

    //  const decrypted =key.decrypt(filterData,'utf8');
    // console.log('decrypted: ', decrypted);
    Object.keys(filterData).forEach(key => !_.isEmpty(filterData[key]) && Number.isNaN(filterData[key].$gte) && delete filterData[key].$gte);
    Object.keys(filterData).forEach(key => !_.isEmpty(filterData[key]) && Number.isNaN(filterData[key].$lte) && delete filterData[key].$lte);
    Object.keys(filterData).forEach(key => _.isEmpty(filterData[key]) && delete filterData[key]);
    Object.keys(filterData).forEach(key => filterData[key] === 'true' && (filterData[key] = true));
    Object.keys(filterData).forEach(key => filterData[key] === 'false' && (filterData[key] = false));
    db.findWithSort(db.COLLECTIONS.FILES, filterData, request.query.offset, request.query.length, {'_id': -1}).then((files) => {
        // for (let file of files.data) {
        //     file.tel1 = (file.tel1 === null || file.tel1 === undefined) ? file.tel1 : key.decrypt(file.tel1, 'utf8');
        //     file.tel2 = (file.tel2 === null || file.tel2 === undefined) ? file.tel2 : key.decrypt(file.tel2, 'utf8');
        //     file.tel3 = (file.tel3 === null || file.tel3 === undefined) ? file.tel3 : key.decrypt(file.tel3, 'utf8');
        //     file.tel4 = (file.tel4 === null || file.tel4 === undefined) ? file.tel4 : key.decrypt(file.tel4, 'utf8');
        //     file.tel5 = (file.tel5 === null || file.tel5 === undefined) ? file.tel5 : key.decrypt(file.tel5, 'utf8');
        //     file.owner = (file.owner === null || file.owner === undefined) ? file.owner : key.decrypt(file.owner, 'utf8');
        // }
        response.status(200).json(files);
    }).catch(() => {
        response.status(409).send("file not found");
    });
});


router.post('/insert', function (request, response, next) {
    let dataObject = {
        Id: request.body.Id,
        Number: request.body.Number,
        tel1: request.body.tel1,//key.encrypt(request.body.tel1, 'base64'),
        tel2: request.body.tel2,//key.encrypt(request.body.tel2, 'base64'),
        tel3: request.body.tel3,//key.encrypt(request.body.tel3, 'base64'),
        tel4: request.body.tel4,//key.encrypt(request.body.tel4, 'base64'),
        tel5: request.body.tel5,//key.encrypt(request.body.tel5, 'base64'),
        owner: request.body.owner,//key.encrypt(request.body.owner, 'base64'),
        iranDate: request.body.iranDate,
        date: request.body.date,
        address: request.body.address,
        regionCode: request.body.regionCode,
        regionName: request.body.regionName,
        sale: request.body.sale,
        rent: request.body.rent,
        mortgage: request.body.mortgage,
        apartment: request.body.apartment,
        land: request.body.land,
        vila: request.body.vila,
        building: request.body.building,
        home: request.body.home,
        oldHouse: request.body.oldHouse,
        office: request.body.office,
        store: request.body.store,
        suit: request.body.suit,
        north: request.body.north,
        south: request.body.south,
        east: request.body.east,
        west: request.body.west,
        unitFloor: request.body.unitFloor,
        unitRoom: request.body.unitRoom,
        unitBalcony: request.body.unitBalcony,
        unitTelephone: request.body.unitTelephone,
        unitWC: request.body.unitWC,
        unitFloorCovering: request.body.unitFloorCovering,
        unitParking: request.body.unitParking,
        unitAnbari: request.body.unitAnbari,
        unitKitchen: request.body.unitKitchen,
        unitBuiltUpArea: request.body.unitBuiltUpArea,
        unitOpen: request.body.unitOpen,
        unitMetri: request.body.unitMetri,
        unitTotalAmount: request.body.unitTotalAmount,
        type: request.body.type,
        floorNo: request.body.floorNo,
        unitNo: request.body.unitNo,
        totalUnit: request.body.totalUnit,
        unitComment: request.body.unitComment,
        totalPrice: request.body.totalPrice,
        unitPrice: request.body.unitPrice,
        priceComment: request.body.priceComment,
        pool: request.body.pool,
        sona: request.body.sona,
        jakozi: request.body.jakozi,
        area: request.body.area,
        density: request.body.density,
        front: request.body.front,
        height: request.body.height,
        modify: request.body.modify,
        yard: request.body.yard,
        smallYard: request.body.smallYard,
        underGround: request.body.underGround,
        employeeService: request.body.employeeService,
        patio: request.body.patio,
        residential: request.body.residential,
        empty: request.body.empty,
        rented: request.body.rented,
        age: request.body.age,
        frontKind: request.body.frontKind,
        source: request.body.source,
        publisher: request.body.publisher,
        ownerInHouse: request.body.ownerInHouse,
        documentKind: request.body.documentKind,
        comment: request.body.comment,
        caseKind: request.body.caseKind,
        srm: request.body.srm,
        inHurry: request.body.inHurry,
        equipments: request.body.equipments,
        archive: request.body.archive,
        participation: request.body.participation,
        exchange: request.body.exchange,
        username: request.body.username,
        noOwnerAccess: request.body.noOwnerAccess,
        isDeleted: request.body.isDeleted,
        isSold: request.body.isSold,
        isRented: request.body.isRented,
        isDontCall: request.body.isDontCall,
    };

    //const encrypted = key.encrypt(dataObject, 'base64');
    // console.log('encrypted: ', encrypted);
    db.insert(db.COLLECTIONS.FILES, dataObject).then((files) => {
        response.status(200).json(files);
    }).catch((error) => {
        response.status(409).send("File did not added");
    });
});

router.post('/edit', function (request, response, next) {
    let query = {
        Id: request.body.Id,
    };
    let newValuesObject = {
        tel1: request.body.tel1,
        tel2: request.body.tel2,
        tel3: request.body.tel3,
        tel4: request.body.tel4,
        tel5: request.body.tel5,
        owner: request.body.owner,
        iranDate: request.body.iranDate,
        date: request.body.date,
        address: request.body.address,
        regionCode: request.body.regionCode,
        regionName: request.body.regionName,
        sale: request.body.sale,
        rent: request.body.rent,
        mortgage: request.body.mortgage,
        apartment: request.body.apartment,
        land: request.body.land,
        vila: request.body.vila,
        building: request.body.building,
        home: request.body.home,
        oldHouse: request.body.oldHouse,
        office: request.body.office,
        store: request.body.store,
        suit: request.body.suit,
        north: request.body.north,
        south: request.body.south,
        east: request.body.east,
        west: request.body.west,
        unitFloor: request.body.unitFloor,
        unitRoom: request.body.unitRoom,
        unitBalcony: request.body.unitBalcony,
        unitTelephone: request.body.unitTelephone,
        unitWC: request.body.unitWC,
        unitFloorCovering: request.body.unitFloorCovering,
        unitParking: request.body.unitParking,
        unitAnbari: request.body.unitAnbari,
        unitKitchen: request.body.unitKitchen,
        unitBuiltUpArea: request.body.unitBuiltUpArea,
        unitOpen: request.body.unitOpen,
        unitTotalAmount: request.body.unitTotalAmount,
        unitMetri: request.body.unitMetri,
        type: request.body.type,
        floorNo: request.body.floorNo,
        unitNo: request.body.unitNo,
        totalUnit: request.body.totalUnit,
        unitComment: request.body.unitComment,
        totalPrice: request.body.totalPrice,
        unitPrice: request.body.unitPrice,
        priceComment: request.body.priceComment,
        pool: request.body.pool,
        sona: request.body.sona,
        jakozi: request.body.jakozi,
        area: request.body.area,
        density: request.body.density,
        front: request.body.front,
        height: request.body.height,
        modify: request.body.modify,
        yard: request.body.yard,
        smallYard: request.body.smallYard,
        underGround: request.body.underGround,
        employeeService: request.body.employeeService,
        patio: request.body.patio,
        residential: request.body.residential,
        empty: request.body.empty,
        rented: request.body.rented,
        age: request.body.age,
        frontKind: request.body.frontKind,
        source: request.body.source,
        publisher: request.body.publisher,
        ownerInHouse: request.body.ownerInHouse,
        documentKind: request.body.documentKind,
        comment: request.body.comment,
        caseKind: request.body.caseKind,
        srm: request.body.srm,
        inHurry: request.body.inHurry,
        equipments: request.body.equipments,
        archive: request.body.archive,
        participation: request.body.participation,
        exchange: request.body.exchange,
        username: request.body.username,
        noOwnerAccess: request.body.noOwnerAccess,
        isDeleted: request.body.isDeleted,
        isSold: request.body.isSold,
        isRented: request.body.isRented,
        isDontCall: request.body.isDontCall,
    };
    Object.keys(newValuesObject).forEach(key => newValuesObject[key] === undefined && delete newValuesObject[key]);
    let newValues = {
        $set: newValuesObject
    };
    db.update(db.COLLECTIONS.FILES, query, newValues).then((files) => {
        response.status(200).json(files);
    }).catch(() => {
        response.status(409).send("File not found");
    });
});

router.post('/insertFromFiling', function (request, response, next) {
    let query = {
        Id: request.body.Id,
    };
    let newValuesObject = {
        Id: request.body.Id,
        Number: request.body.Number,
        tel1: request.body.tel1,//key.encrypt(request.body.tel1, 'base64'),
        tel2: request.body.tel2,//key.encrypt(request.body.tel2, 'base64'),
        tel3: request.body.tel3,//key.encrypt(request.body.tel3, 'base64'),
        tel4: request.body.tel4,//key.encrypt(request.body.tel4, 'base64'),
        tel5: request.body.tel5,//key.encrypt(request.body.tel5, 'base64'),
        owner: request.body.owner,//key.encrypt(request.body.owner, 'base64'),
        iranDate: request.body.iranDate,
        date: request.body.date,
        address: request.body.address,
        regionCode: request.body.regionCode,
        regionName: request.body.regionName,
        sale: request.body.sale,
        rent: request.body.rent,
        mortgage: request.body.mortgage,
        apartment: request.body.apartment,
        land: request.body.land,
        vila: request.body.vila,
        building: request.body.building,
        home: request.body.home,
        oldHouse: request.body.oldHouse,
        office: request.body.office,
        store: request.body.store,
        suit: request.body.suit,
        north: request.body.north,
        south: request.body.south,
        east: request.body.east,
        west: request.body.west,
        unitFloor: request.body.unitFloor,
        unitRoom: request.body.unitRoom,
        unitBalcony: request.body.unitBalcony,
        unitTelephone: request.body.unitTelephone,
        unitWC: request.body.unitWC,
        unitFloorCovering: request.body.unitFloorCovering,
        unitParking: request.body.unitParking,
        unitAnbari: request.body.unitAnbari,
        unitKitchen: request.body.unitKitchen,
        unitBuiltUpArea: request.body.unitBuiltUpArea,
        unitOpen: request.body.unitOpen,
        unitMetri: request.body.unitMetri,
        unitTotalAmount: request.body.unitTotalAmount,
        type: request.body.type,
        floorNo: request.body.floorNo,
        unitNo: request.body.unitNo,
        totalUnit: request.body.totalUnit,
        unitComment: request.body.unitComment,
        totalPrice: request.body.totalPrice,
        unitPrice: request.body.unitPrice,
        priceComment: request.body.priceComment,
        pool: request.body.pool,
        sona: request.body.sona,
        jakozi: request.body.jakozi,
        area: request.body.area,
        density: request.body.density,
        front: request.body.front,
        height: request.body.height,
        modify: request.body.modify,
        yard: request.body.yard,
        smallYard: request.body.smallYard,
        underGround: request.body.underGround,
        employeeService: request.body.employeeService,
        patio: request.body.patio,
        residential: request.body.residential,
        empty: request.body.empty,
        rented: request.body.rented,
        age: request.body.age,
        frontKind: request.body.frontKind,
        source: request.body.source,
        publisher: request.body.publisher,
        ownerInHouse: request.body.ownerInHouse,
        documentKind: request.body.documentKind,
        comment: request.body.comment,
        caseKind: request.body.caseKind,
        srm: request.body.srm,
        inHurry: request.body.inHurry,
        equipments: request.body.equipments,
        archive: request.body.archive,
        participation: request.body.participation,
        exchange: request.body.exchange,
        username: request.body.username,
        noOwnerAccess: request.body.noOwnerAccess,
        isDeleted: request.body.isDeleted,
        isSold: request.body.isSold,
        isRented: request.body.isRented,
        isDontCall: request.body.isDontCall,
    };
    Object.keys(newValuesObject).forEach(key => newValuesObject[key] === undefined && delete newValuesObject[key]);
    let newValues = {
        $set: newValuesObject
    };
    db.update(db.COLLECTIONS.FILES, query, newValues, { upsert: true }).then((files) => {
        response.status(200).json(files);
    }).catch(() => {
        response.status(409).send("File not found");
    });
});

router.post('/delete', function (request, response, next) {
    let query = {
        Id: !_.isEmpty(request.body) ? {$in: request.body} : undefined,
    };
    db.deleteManyFunction(db.COLLECTIONS.FILES, query).then((files) => {
        response.status(200).json(files);
    }).catch(() => {
        response.status(409).send("File not found");
    });
});

module.exports = router;
