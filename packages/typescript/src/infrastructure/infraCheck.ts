import axios from 'axios';

export async function checkOllamaStatus(baseUrl: string = 'http://localhost:11434'): Promise<boolean> {
  try {
    const response = await axios.get(`${baseUrl}/api/tags`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}
