import mysql from 'mysql2/promise'

const initDb = async () => {
    return await mysql.createPool(process.env.MYSQL_CONNECTION_STRING || 'mysql://nexususer:nexuspassword@localhost:3306/nexus');
};

export { initDb };
