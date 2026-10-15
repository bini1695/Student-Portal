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

    const [roles] = await conn.query('SELECT id, name FROM roles ORDER BY id');
    console.log('📋 ROLES:');
    roles.forEach((r) => console.log(`   ${r.id}: ${r.name}`));

    const [users] = await conn.query(`
      SELECT u.id, u.email, u.full_name, r.name AS role
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.id
    `);
    console.log('\n📋 USERS:');
    if (users.length === 0) {
      console.log('   (no users)');
    } else {
      users.forEach((u) =>
        console.log(`   #${u.id} ${u.email} — ${u.role} — ${u.full_name}`),
      );
    }

    await conn.end();
  } catch (e) {
    console.error('❌', e.message);
  }
})();