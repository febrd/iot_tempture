import { Hono } from 'hono';
import { fetchDataFromFirebase } from '../utils/fetchData';
import { getFilteredData } from '../utils/filterData';
import { hasHighTemperature, hasHighHumidity, sendCombinedAlerts, AlertData } from '../utils/alertData'; 
import { getTargetGroupId } from '../utils/whatsappGateway'; // Make sure the path is correct

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

// Filter sensor data by humidity
sensorRoutes.get('/filter/humid/:humidity', async (c) => {
  const { humidity } = c.req.param();
  const data = await fetchDataFromFirebase();
  const filteredData = getFilteredData(data, 'realtime', undefined, humidity);
  return c.json(filteredData);
});

sensorRoutes.get('/check/high-temperature', async (c) => {
    const data: AlertData[] = await fetchDataFromFirebase();
    const hasHighTemp = hasHighTemperature(data);
    
    const targetGroupId = await getTargetGroupId();
    
    if (hasHighTemp.length > 0 && targetGroupId) {
      await sendCombinedAlerts(data, targetGroupId); // Send alerts using group ID
    }
  
    return c.json({ hasHighTemperature: hasHighTemp });
  });
  
  // Check for high humidity and send alerts
  sensorRoutes.get('/check/high-humidity', async (c) => {
    const data: AlertData[] = await fetchDataFromFirebase();
    const hasHighHum = hasHighHumidity(data);
    
    const targetGroupId = await getTargetGroupId();
    
    if (hasHighHum.length > 0 && targetGroupId) {
      await sendCombinedAlerts(data, targetGroupId); // Send alerts using group ID
    }
  
    return c.json({ hasHighHumidity: hasHighHum });
  });
    

export default sensorRoutes;
