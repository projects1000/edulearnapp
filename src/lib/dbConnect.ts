import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://playschool:mKzypUO0AJjPJ1NPNtHxGmJdPYP6uzgC@dpg-d3kj2cnfte5s738dtc20-a.oregon-postgres.render.com/playschooldb',
  ssl: { rejectUnauthorized: false }
});

export default pool;
