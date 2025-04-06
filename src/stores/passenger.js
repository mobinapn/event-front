import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const usePassengerStore = defineStore('passenger', {
  state: () => ({
    passengers: [],
    loading: false,
    error: ''
  }),
  
  getters: {
    getPassengerById: (state) => (id) => {
      return state.passengers.find(passenger => passenger.id === id);
    },
    totalPassengers: (state) => {
      return state.passengers.length;
    },
    hasPassengers: (state) => {
      return state.passengers.length > 0;
    }
  },
  
  actions: {
    async fetchPassengers() {
      this.loading = true;
      this.error = '';
      
      try {
        const response = await api.get('/profile/passengers');
        this.passengers = response.data;
      } catch (err) {
        console.error('Error fetching passengers:', err);
        this.error = 'خطا در بارگیری اطلاعات مسافران. لطفا دوباره تلاش کنید.';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    
    async addPassenger(passengerData) {
        console.log('Sending passenger data:', passengerData); // بررسی داده‌های ارسالی
      try {
        const response = await api.post('/profile/passengers', passengerData);
        this.passengers.push(response.data);
        return response.data;
      } catch (err) {
        console.error('Error adding passenger:', err);
        throw err;
      }
    },
    
    async updatePassenger(passengerData) {
      // Note: Since there is no actual PUT endpoint yet,
      // this is just updating the local state
      try {
        // In a real implementation, you would have:
        // const response = await api.put(`/profile/passengers/${passengerData.id}`, passengerData);
        
        // For now, just update local state
        const index = this.passengers.findIndex(p => p.id === passengerData.id);
        if (index !== -1) {
          this.passengers[index] = {
            ...this.passengers[index],
            ...passengerData
          };
        }
        return this.passengers[index];
      } catch (err) {
        console.error('Error updating passenger:', err);
        throw err;
      }
    },
    
    async deletePassenger(passengerId) {
      try {
        await api.delete(`/profile/passengers/${passengerId}`);
        
        // Remove from state
        const index = this.passengers.findIndex(p => p.id === passengerId);
        if (index !== -1) {
          this.passengers.splice(index, 1);
        }
      } catch (err) {
        console.error('Error deleting passenger:', err);
        throw err;
      }
    },
    
    // Method for reservation process to select passengers
    selectPassengerForReservation(passengerId) {
      const passenger = this.getPassengerById(passengerId);
      if (!passenger) {
        throw new Error('مسافر انتخاب شده یافت نشد');
      }
      return passenger;
    }
  }
});