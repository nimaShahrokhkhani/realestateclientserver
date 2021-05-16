var express = require('express');
var router = express.Router();
var db = require('../../helper/db');
var multer = require('multer');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var _ = require('underscore');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
var upload = multer({storage: storage});

router.get('/list', function (request, response, next) {
    let filterData = {
        username: request.query.username,
        name: request.query.name,
        lastName: request.query.lastName,
        userRole: request.query.userRole,
        password: request.query.password,
        shenaSName: request.query.shenaSName,
        nationalId: request.query.nationalId,
        birthDate: request.query.birthDate,
        birthPlace: request.query.birthPlace,
        address: request.query.address,
        tel: request.query.tel,
        recruitedDate: request.query.recruitedDate,
        profession: request.query.profession,
        minimumSalary: request.query.minimumSalary,
        comment: request.query.comment,
        priceFrom: request.query.priceFrom,
        priceTo: request.query.priceTo,
        priceFromMeter: request.query.priceFromMeter,
        priceToMeter: request.query.priceToMeter,
        insertFile: request.query.insertFile,
        deleteFile: request.query.deleteFile,
        editFile: request.query.editFile,

    };
    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.USERS, filterData, request.query.offset, request.query.length).then((users) => {
        response.status(200).json(users);
    }).catch(() => {
        response.status(409).send("Username not found");
    });
});

router.get('/download', function (req, res) {

    var file = __dirname + '/uploads/' + req.query.fileName;

    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
});

router.post('/insert', function (request, response, next) {
    let dataObject = {
        username: request.body.username,
        name: request.body.name,
        lastName: request.body.lastName,
        userRole: request.body.userRole,
        password: request.body.password,
        shenaSName: request.body.shenaSName,
        nationalId: request.body.nationalId,
        birthDate: request.body.birthDate,
        birthPlace: request.body.birthPlace,
        address: request.body.address,
        tel: request.body.tel,
        recruitedDate: request.body.recruitedDate,
        profession: request.body.profession,
        minimumSalary: request.body.minimumSalary,
        comment: request.body.comment,
        priceFrom: request.body.priceFrom,
        priceTo: request.body.priceTo,
        priceFromMeter: request.body.priceFromMeter,
        priceToMeter: request.body.priceToMeter,
        insertFile: request.body.insertFile,
        deleteFile: request.body.deleteFile,
        editFile: request.body.editFile,
    };

    var filterData = {
        username: request.body.username
    };

    db.find(db.COLLECTIONS.USERS, filterData).then((users) => {
        if (_.isEmpty(users)) {
            db.insert(db.COLLECTIONS.USERS, dataObject).then((res) => {
                response.status(200).json(res);
            }).catch((error) => {
                response.status(409).send("User did not added");
            });
        } else {
            response.status(409).send("User did not added");
        }
    }).catch(() => {
        db.insert(db.COLLECTIONS.USERS, dataObject).then((res) => {
            response.status(200).json(res);
        }).catch(() => {
            response.status(409).send("User did not added");
        });
    });
});

router.post('/edit', upload.single('file'), function (request, response, next) {
    let query = {
        username: request.body.username
    };
    let newValuesObject = {
        username: request.body.username,
        name: request.body.name,
        lastName: request.body.lastName,
        userRole: request.body.userRole,
        password: request.body.password,
        shenaSName: request.body.shenaSName,
        nationalId: request.body.nationalId,
        birthDate: request.body.birthDate,
        birthPlace: request.body.birthPlace,
        address: request.body.address,
        tel: request.body.tel,
        recruitedDate: request.body.recruitedDate,
        profession: request.body.profession,
        minimumSalary: request.body.minimumSalary,
        comment: request.body.comment,
        priceFrom: request.body.priceFrom,
        priceTo: request.body.priceTo,
        priceFromMeter: request.body.priceFromMeter,
        priceToMeter: request.body.priceToMeter,
        insertFile: request.body.insertFile,
        deleteFile: request.body.deleteFile,
        editFile: request.body.editFile,
    };
    Object.keys(newValuesObject).forEach(key => newValuesObject[key] === undefined && delete newValuesObject[key]);
    let newValues = {
        $set: newValuesObject
    };
    db.update(db.COLLECTIONS.USERS, query, newValues).then((users) => {
        response.status(200).json(users);
    }).catch(() => {
        response.status(409).send("Username not found");
    });
});

router.post('/delete', function (request, response, next) {
    let query = {
        username: request.body.username
    };
    db.deleteFunction(db.COLLECTIONS.USERS, query).then((users) => {
        response.status(200).json(users);
    }).catch(() => {
        response.status(409).send("Username not found");
    });
});

module.exports = router;
