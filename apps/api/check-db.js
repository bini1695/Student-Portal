require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'student_portal',
    });

    console.log('✅ Connected to MySQL');
    console.log('   DB:', process.env.DB_NAME || 'student_portal');

    const [tables] = await conn.query('SHOW TABLES');
    console.log('\n📋 TABLES (' + tables.length + '):');
    tables.forEach((t) => console.log('   - ' + Object.values(t)[0]));

    await conn.end();
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
})();