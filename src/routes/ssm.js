const express = require('express');
const ssm = require('../services/ssm.js');
const router = express.Router({mergeParams: true});

router.get('/entities/:type/:ssmid', async (req, res, next) => {
    try {
        const type = req.params.type;
        const ssmid = req.params.ssmid;
        const payload = await ssm.companies(type, ssmid);
        return res.status(200).json({
            error: false,
            code: 200,
            message: payload
        });
    } catch (e) {
        return res.status(500).json({
            error: true,
            code: 500,
            message: e.message
        });
    }
});
router.get('/type', async (req, res, next) => {
    try {
        const payload = await ssm.types();
        return res.status(200).json({
            error: false,
            code: 200,
            message: payload
        });
    } catch (e) {
        return res.status(500).json({
            error: true,
            code: 500,
            message: e.message
        });
    }
});

module.exports = {
    ssm: router
};
