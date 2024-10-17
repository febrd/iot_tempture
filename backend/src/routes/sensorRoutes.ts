import { Hono } from 'hono';
import { fetchDataFromFirebase } from '../utils/fetchData';
import { getFilteredData } from '../utils/filterData';
import { hasHighTemperature, hasHighHumidity, alertData } from '../utils/alertData'; 

const sensorRoutes = new Hono();

sensorRoutes.get('/all', async (c) => {
  const data = await fetchDataFromFirebase();
  return c.json(data);
});

sensorRoutes.get('/filter/range/:range', async (c) => {
  const { range } = c.req.param();
  const data = await fetchDataFromFirebase();
  const filteredData = getFilteredData(data, range);
  return c.json(filteredData);
});

sensorRoutes.get('/filter/temp/:temp', async (c) => {
  const { temp } = c.req.param();
  const data = await fetchDataFromFirebase();
  const filteredData = getFilteredData(data, 'realtime', temp);
  return c.json(filteredData);
});

sensorRoutes.get('/filter/humid/:humidity', async (c) => {
  const { humidity } = c.req.param();
  const data = await fetchDataFromFirebase();
  const filteredData = getFilteredData(data, 'realtime', undefined, humidity);
  return c.json(filteredData);
});


sensorRoutes.get('/check/high-temperature', async (c) => {
    const data: alertData[] = await fetchDataFromFirebase();
    const hasHighTemp = hasHighTemperature(data);
    return c.json({ hasHighTemperature: hasHighTemp });
  });
  
  sensorRoutes.get('/check/high-humidity', async (c) => {
    const data: alertData[] = await fetchDataFromFirebase();
    const hasHighHum = hasHighHumidity(data);
    return c.json({ hasHighHumidity: hasHighHum });
  });

  



export default sensorRoutes;
