import axios from 'axios';
import { TOKEN, FONNTE_API_URL, ALERT_TEMPERATURE, ALERT_HUMIDITY } from './whatsappGateway'; // Ensure paths are correct

export interface AlertData {
  temperature: string;
  humidity: string;
  timestamp: string;
}

// Function to filter and generate high temperature alerts
export function hasHighTemperature(data: AlertData[]): string[] {
  return data
    .filter((item) => parseFloat(item.temperature) > 40)
    .map(
      (item) =>
        `🚨 High temperature alert at ${item.timestamp}: ${item.temperature} °C`
    );
}

// Function to filter and generate high humidity alerts
export function hasHighHumidity(data: AlertData[]): string[] {
  return data
    .filter((item) => parseFloat(item.humidity) > 45)
    .map(
      (item) =>
        `💧 High humidity alert at ${item.timestamp}: ${item.humidity}%`
    );
}

export const sendAlertNotification = async (message: string, target: string) => {
    try {
      // Log the data being sent
      console.log('Sending alert notification with the following data:', {
        target: target,
        message: message,
      });
  
      const response = await axios.post(
        `${FONNTE_API_URL}/send`,
        {
          target: target,
          message: message,
        },
        {
          headers: {
            Authorization: TOKEN,
          },
        }
      );
  
      console.log('Alert notification sent successfully:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error sending alert notification:',
          error.response?.data || error.message
        );
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  };
// Helper function to send alerts for both temperature and humidity
export const sendCombinedAlerts = async (data: AlertData[], groupId: string) => {
  const temperatureAlerts = hasHighTemperature(data);
  const humidityAlerts = hasHighHumidity(data);

  const alerts = [...temperatureAlerts, ...humidityAlerts];

  for (const alert of alerts) {
    await sendAlertNotification(alert, groupId); // Use groupId as target
  }
};
