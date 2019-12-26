const express = require('express'),
    Router = express.Router(),
    Account = require('../core/account'),
    Device = require('../core/device');

Router.post("/account/event/", async (req, res) => {
    // console.log(req.body.event);
    console.log("hello Router:" + req.body.firs);

    switch (req.body.event) {
        case "login":
            var login = await Account.view(req.body.event, req.body);
            res.send(login);
            break;

        case "register":
            var count = await Account.view("check", req.body);
            console.log(req.body);
            if (count > 0) {
                res.send(JSON.stringify({ 'result': 'Email is already registered' }));
            } else {
                var add_reg = await Account.add("add_account", req.body);
                res.send(JSON.stringify({ 'result': add_reg }));
            }
            break;

        default:
            break;
    }
});

Router.post("/device/register-device/", async (req, res) => {
    console.log("router =>" + req.body.event);
    switch (req.body.event) {
        case "register-devices":
            //var count = await device.view("check", req.body);
            var register_device = await Device.adding(req.body.event, req.body);
            res.send(JSON.stringify({ 'result': register_device }));
            break;
        case "view-registered-device":
            var view_register_device = await Device.adding(req.body.event, req.body);
            res.send(view_register_device);
            break;
        case "toogle-device":
            var toogle = await Device.adding(req.body.event, req.body);
            res.send(JSON.stringify({ 'result': toogle }));
            break;
        case "modal-appliances":
            var modal_appliances = await Device.adding(req.body.event, req.body);
            //res.send(JSON.stringify({ 'result': modal_appliances }));
            res.send(modal_appliances);
        default:
            break;
    }
});
Router.post("/devices/event/", async (req, res) => {
    var _response = [];
    var num = await Device._view(req.query.event, req.body);
    Object.values(num).forEach(val => {
        _response.push(val);
    });
    console.log(JSON.stringify({ reg: _response[0], unreg: _response[1] }));
    res.send(JSON.stringify({ reg: _response[0], unreg: _response[1] }));
});

module.exports = Router;