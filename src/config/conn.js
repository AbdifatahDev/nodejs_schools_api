const mysql = require('mysql2/promise');

const conn = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'barbaariye_app'
};

async function getConnection() {
    return await mysql.createConnection(conn);
}

module.exports = getConnection;