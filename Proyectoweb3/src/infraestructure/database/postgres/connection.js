const { Pool } = require('pg');
const { dbConfig } = require('../../../config/env');

const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Simular sequelize para compatibilidad
const sequelize = {
  authenticate: async () => {
    const client = await pool.connect();
    client.release();
    return true;
  },
  query: (text, params) => pool.query(text, params),
  pool
};

module.exports = { pool, sequelize };