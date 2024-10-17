import { Hono } from 'hono';
import modbusRoutes from './routes/modbusRoutes';
import docsRoutes from './routes/docsRoutes';
import sensorRoutes from './routes/sensorRoutes';


const app = new Hono();

app.route('/', docsRoutes);
//app.route('/api', modbusRoutes);


app.route('/api/sensor', sensorRoutes);



export default app;
