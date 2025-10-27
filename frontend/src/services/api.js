import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000', // ajuste se seu backend estiver em outra URL
  timeout: 10000
})
