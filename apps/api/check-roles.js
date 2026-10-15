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

    const [roles] = await conn.query('SELECT * FROM roles');
    console.log('ROLES IN DATABASE:');
    roles.forEach((r) => console.log(`  id=${r.id} name=${r.name}`));

    const [users] = await conn.query(
      'SELECT u.id, u.email, u.full_name, r.name AS role FROM users u LEFT JOIN roles r ON u.role_id = r.id',
    );
    console.log('\nUSERS IN DATABASE:');
    users.forEach((u) => console.log(`  ${u.email} — ${u.role} — ${u.full_name}`));

    await conn.end();
  } catch (e) {
    console.error('❌', e.message);
  }
})();