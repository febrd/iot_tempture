export interface alertData {
    temperature: string; // Dianggap sebagai string karena data yang diterima dari Firebase
    humidity: string;    // Dianggap sebagai string
    timestamp: string;
  }
  
  export function hasHighTemperature(data: alertData[]): boolean {
    return data.some((item) => parseFloat(item.temperature) > 40);
  }
  
  export function hasHighHumidity(data: alertData[]): boolean {
    return data.some((item) => parseFloat(item.humidity) > 45);
  }
  