import axios from 'axios';

export async function getBookings() {
	const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
	const config = {
      headers: {
         Authorization: `Bearer ${token}`
      }
   };

   try {
      const response = await axios.get('https://localhost:7048/api/bookings', config);
      return response.data;
   } catch (error) {
      console.error('Error:', error);
      return null;
   }
};

export async function createBooking(bookingData) {
	const token = typeof window!== 'undefined' ? localStorage.getItem('authToken') : null;
  const config = {
      headers: {
         Authorization: `Bearer ${token}`
      }
   };

  try {
      const response = await axios.post('https://localhost:7048/api/bookings', bookingData, config);
      return response.data;
   } catch (error) {
      console.error('Error:', error);
      return null;
   }
}

export async function updateBooking(bookingId, bookingData) {
	const token = typeof window!== 'undefined' ? localStorage.getItem('authToken') : null;
  const config = {
      headers: {
         Authorization: `Bearer ${token}`
      }
   };

  try {
      const response = await axios.put(`https://localhost:7048/api/bookings/${bookingId}`, bookingData, config);
      return response.data;
   } catch (error) {
      console.error('Error:', error);
      return null;
   }
}

export async function deleteBooking(bookingId) {
	const token = typeof window!== 'undefined' ? localStorage.getItem('authToken') : null;
  const config = {
      headers: {
         Authorization: `Bearer ${token}`
      }
   };

  try {
      await axios.delete(`https://localhost:7048/api/bookings/${bookingId}`, config);
   } catch (error) {
      console.error('Error:', error);
   }
}
