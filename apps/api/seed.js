require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'student_portal',
  });

  console.log('✅ Connected to MySQL');

  await conn.query(`
    INSERT IGNORE INTO roles (id, name, description) VALUES
    (1, 'super_admin', 'System owner with full control'),
    (2, 'admin', 'Administrator / Registrar'),
    (3, 'teacher', 'Faculty / Instructor'),
    (4, 'student', 'Enrolled student'),
    (5, 'accountant', 'Finance staff'),
    (6, 'dept_head', 'Department Head')
  `);
  console.log('✅ Roles seeded');

  await conn.query(`
    INSERT IGNORE INTO users (id, role_id, email, password_hash, full_name, status)
    VALUES (1, 1, 'admin@school.com',
    '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfgqwAG5hFs3hJqQZbI1cY3JmGpZtPzO',
    'Super Admin', 'active')
  `);
  console.log('✅ Admin user seeded');

  const [roles] = await conn.query('SELECT id, name FROM roles');
  console.log('Roles in DB:', roles);

  const [users] = await conn.query('SELECT id, email, full_name FROM users');
  console.log('Users in DB:', users);

  await conn.end();
  console.log('🎉 Done!');
})().catch((err) => {
  console.error('❌ Error:', err.message);
  console.error('Code:', err.code);
  process.exit(1);
});