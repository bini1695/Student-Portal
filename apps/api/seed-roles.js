require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'student_portal',
    });

    console.log('✅ Connected to MySQL');

    // Insert roles (skip if exist)
    await conn.query(`
      INSERT IGNORE INTO roles (id, name, description) VALUES
      (1, 'super_admin', 'System owner with full control'),
      (2, 'admin', 'Administrator / Registrar'),
      (3, 'teacher', 'Faculty / Instructor'),
      (4, 'student', 'Enrolled student'),
      (5, 'accountant', 'Finance staff'),
      (6, 'dept_head', 'Department Head')
    `);

    console.log('✅ Roles inserted/verified');

    // Show all roles
    const [roles] = await conn.query('SELECT id, name FROM roles ORDER BY id');
    console.log('\n📋 ROLES IN DATABASE:');
    roles.forEach((r) => console.log(`   ${r.id}: ${r.name}`));

    await conn.end();
    console.log('\n🎉 Done!');
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.error('Code:', e.code);
    process.exit(1);
  }
})();