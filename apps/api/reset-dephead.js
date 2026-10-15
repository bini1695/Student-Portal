require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'student_portal',
    });

    console.log('✅ Connected to MySQL');

    // Check if user exists
    const [users] = await conn.query(
      "SELECT id, email, full_name, role_id FROM users WHERE email = 'dephead@gmail.com'",
    );

    if (users.length === 0) {
      console.log('❌ User not found. Creating it now...');
      const hash = await bcrypt.hash('dephead123', 10);
      await conn.query(
        `INSERT INTO users (role_id, email, password_hash, full_name, status)
         VALUES (6, 'dephead@gmail.com', ?, 'Charlie Head', 'active')`,
        [hash],
      );
      console.log('✅ User created!');
      console.log('   Email:    dephead@gmail.com');
      console.log('   Password: dephead123');
      console.log('   Role:     dept_head (id=6)');
    } else {
      console.log('📋 User exists:', users[0]);

      // Reset password + role
      const hash = await bcrypt.hash('dephead123', 10);
      const [result] = await conn.query(
        `UPDATE users
         SET password_hash = ?, role_id = 6, status = 'active'
         WHERE email = 'dephead@gmail.com'`,
        [hash],
      );

      console.log('✅ Updated — rows affected:', result.affectedRows);
      console.log('   New password: dephead123');
      console.log('   Role:         dept_head');
    }

    // Verify
    const [check] = await conn.query(`
      SELECT u.id, u.email, u.full_name, u.status, r.name AS role
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.email = 'dephead@gmail.com'
    `);
    console.log('\n📋 Final record:');
    console.log(check[0]);

    await conn.end();
    console.log('\n🎉 Done!');
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.error('   Code:', e.code);
  }
})();