import "dotenv/config";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const test = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Connected to DB:", res.rows[0]);
  } catch (err) {
    console.error("❌ Connection failed:");
    console.error(err); // full error object
  } finally {
    await pool.end();
  }
};

test();
