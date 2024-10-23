import { Hono, Context, Next } from 'hono';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../', '.env') });

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const dataRoutes = new Hono();

const corsMiddleware = async (c: Context, next: Next) => {
  c.res.headers.append('Access-Control-Allow-Origin', 'http://localhost:3001');
  c.res.headers.append('Access-Control-Allow-Methods', 'GET, OPTIONS');
  c.res.headers.append('Access-Control-Allow-Headers', 'Content-Type');

  if (c.req.method === 'OPTIONS') {
    return c.text('OK', 204);
  }

  await next();
};

dataRoutes.use(corsMiddleware);

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  return date.toLocaleString('sv-SE', options).replace(' ', 'T');
};

dataRoutes.get('/chart/:apiKey', async (c) => {
  const { apiKey } = c.req.param(); 
  if (apiKey !== process.env.LOCAL_API_KEY) {
    console.warn('Unauthorized access attempt detected');
    return c.text('Unauthorized', 401);
  }

  const { start, end, minute } = c.req.query(); 
  console.log(`Query Params Received -> minute: ${minute}, start: ${start}, end: ${end}`);

  try {
    const connection = await mysql.createConnection(dbConfig);

    let query = 'SELECT * FROM sensor';
    const queryParams: any[] = [];

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    query += ' WHERE timestamp BETWEEN ? AND ?';
    queryParams.push(startOfDay, endOfDay);

    // If a specific minute is provided
    if (minute) {
      query += ' AND DATE_FORMAT(timestamp, "%i") = ?';
      queryParams.push(minute.toString().padStart(2, '0')); // Ensure 2 digits
    }

    if (start && end) {
      query += ' AND timestamp BETWEEN ? AND ?';
      queryParams.push(start, end);
    }

    console.log(`Executing Query: ${query} with params: ${queryParams}`);

    const [rows] = await connection.execute<any[]>(query, queryParams);
    await connection.end();

    console.log(`Fetched ${rows.length} rows from database.`);

    const formattedData = rows.map((row) => ({
      temperature: row.temperature.toString(),
      humidity: row.humidity.toString(),
      timestamp: formatTimestamp(row.timestamp),
    }));

    return c.json(formattedData);
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    return c.text('Internal Server Error', 500);
  }
});

export default dataRoutes;
