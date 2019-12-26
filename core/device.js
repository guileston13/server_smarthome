const db = require('../connection');

function _view(event, data) {
    return new Promise(function (resolve, reject) {
        var macaddr = data.macAddress;
        switch (event) {
            case "check":
                var sql_search = "SELECT * FROM registered_devices WHERE macAddress = '" + data.macAddress + "'";
                var sql_add = "INSERT INTO unregistered_devices (macAddress) VALUES ('" + macaddr + "')";
                var sql_check = "SELECT * FROM unregistered_devices WHERE macAddress = '" + macaddr + "'";
                const _check = new Promise((resolve, reject) => {
                    db.query(sql_search, (err, rows, results) => {
                        console.log("Register device => " + rows.length);
                        resolve(rows.length);
                    });
                });
                const _unreg = new Promise((resolve, reject) => {
                    db.query(sql_check, (err, rows, result) => {
                        if (rows.length == 0) {
                            db.query(sql_add, (err, rows, result) => {
                                // console.log("results => " + rows[0].macAddress);
                                console.log("Affected rows => " + rows.affectedRows);
                                resolve(rows.affectedRows);
                            });
                        }
                        else {
                            console.log(rows[0].macAddress);
                            resolve(rows.length);
                        }
                    });
                });
                resolve(Promise.all([_check, _unreg]));
                break;
            case "unregistered-devices":
                var sql_unreg = "SELECT * FROM unregistered_devices";
                db.query(sql_unreg, (err, rows, results) => {
                    if (results.length > 0) {
                        console.log(rows[0].macAddress);
                        console.log(results.length);
                        console.log(JSON.stringify(rows));
                        resolve(results.length);
                    }
                });
                break;
            case "device-state":
                var sql_state = "SELECT * FROM registered_devices LEFT JOIN accounts ON registered_devices.accoundID = accounts._id AND registered_devices.accountID = '" + data.accountID;
                db.query(sql_state, (err, rows, results) => {
                    if (err == null) {
                        if (rows.length > 0) {
                            resolve(rows);
                        }
                    }
                })
            default:
                break;
        }
    });

}


function adding(event, data) {
    return new Promise((resolve, reject) => {
        // console.dir(data, { depth: null });
        // console.log(data.accountID);
        switch (event) {
            case "register-devices":
                console.log("control->:adding");
                var sql_register_device = "INSERT INTO registered_devices (application, deviceLists, area, macAddress, state, accountID) VALUES ('" + data.appliances + "','" + data.deviceList + "','" + data.area + "','" + data.macAddress + "','" + 1 + "','" + data.accountID + "')";
                db.query(sql_register_device, (err, rows, results) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(results);
                    }
                });
                break;

            case "view-registered-device":
                console.log("view-regs-dv" + data.accountID);
                var sql_view = "SELECT *,registered_devices._id as registered_devices_id from accounts,registered_devices " +
                    "where accounts._id = registered_devices.accountID AND accounts._id = '" + data.accountID + "'";
                db.query(sql_view, (err, rows, results) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
                break;

            case "toogle-device":
                var new_device_status = '';
                data.status == 0 ? new_device_status = 1 : new_device_status = 0;
                var sql_toogle = "UPDATE registered_devices SET status = '" + new_device_status + "'WHERE registered_devices._id = '" + data.registered_device_id + "'";
                db.query(sql_toogle, (err, rows, results) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(results);
                    }
                });
                break;
            case "modal-appliances":
                var sql_modal_appliances = "SELECT * from registered_devices where _id ='" + data.device_id + "'";
                db.query(sql_modal_appliances, (err, rows, results) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
            default:
                break;
        }
    });
}
function add(event, data) {
    var macaddr = data.macAddress;
    return new Promise((resolve, reject) => {
        switch (event) {
            case "register-devices":
                var sql_retreive = "SELECT * FROM unregistered_devices WHERE macAddress = '" + macaddr + "'";
                var sql_remove = "DELETE FROM unregistered_devices WHERE macAddress = '" + macaddr + "'";
                db.query(sql_retreive, (err, rows, result) => {
                    if (rows.length > 1) {
                        db.query(sql_remove, (err, rows, result) => {
                            resolve(rows.affectedRows);
                        });
                    }
                });
                break;
            case "":
            default:
                break;
        }
    });
}
module.exports = {
    _view: _view,
    adding: adding
}