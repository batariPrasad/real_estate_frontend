import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Allows access from both localhost and network IP
      port: 3000, // Change if needed
      strictPort: true, // Ensures the port doesn't change if 5173 is busy
    },
  };
});
