var express = require('express');
var router = express.Router();
const sessionManager = require('../helper/sessionManager');


router.use(sessionManager.initialize());
router.use('/login', require('./login'));
router.use('/register', require('./register'));
router.use('/devices', require('./devices'));
router.use('/configs', require('./configs'));
router.use('/users', require('./users'));

router.use((request, response, next) => {
    sessionManager.getSession(request)
        .then((session) => {
            next();
        })
        .catch((error) => {
            next(error);
        });
});

router.use('/files', require('./files'));
router.use('/zonkan', require('./zonkan'));

module.exports = router;
