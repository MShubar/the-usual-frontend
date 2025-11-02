export const API_BACKEND = import.meta.env.VITE_API_BACKEND || 
  (import.meta.env.DEV 
    ? 'http://localhost:8080' 
    : 'https://the-usual-backend-gnavf2dkdebghhh3.canadacentral-01.azurewebsites.net')