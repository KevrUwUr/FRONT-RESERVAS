import axios from 'axios';

export async function getClients() {  
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const config = {
      headers: {
         Authorization: `Bearer ${token}`
      }
   };

   try {
      const response = await axios.get('https://localhost:7048/api/clients', config);      
      return response.data;
   } catch (error) {
      console.error('Error:', error);
      return null;
   }
};
