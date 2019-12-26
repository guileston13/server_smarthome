const db = require('../connection');
function view(event, data) {
    return new Promise((resolve, reject) => {
        console.log("event => " + event);
        console.log("data => " + data.firstname);
        console.dir(data, { depth: null });
        switch (event) {
            case "check":
                var sql_search = "SELECT * FROM accounts WHERE email = '" + data.firstname + "' AND firstName = '" + data.firstname + "'";
                db.query(sql_search, (err, rows, results) => {
                    resolve(rows.length);
                });
                break;
            case "login":
                var sql_login = "SELECT * FROM accounts WHERE firstname = '" + data.firstname + "' AND password = '" + data.password + "'";
                db.query(sql_login, (err, rows, results) => {
                    console.log(rows);
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                })
            default:
                break;
        }
    });
}

function add(event, data) {
    console.log(data);
    return new Promise((resolve, reject) => {
        switch (event) {
            case "add_account":
                var sql_add = "INSERT INTO accounts (firstName, lastName, email, contactNumber, password, birthday) VALUES ('" + data.firstName + "','" + data.lastName + "','" + data.email + "','" + data.contactNumber + "','" + data.password + "','" + data.birthday + "')";
                db.query(sql_add, (err, rows, results) => {
                    if (!err) {
                        resolve(results);
                    }
                });
                break;
            default:
                break;
        }
    });
}

module.exports = {
    view: view,
    add: add
}