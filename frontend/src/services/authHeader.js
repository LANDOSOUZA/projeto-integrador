// 📂 src/services/authHeader.js
export default function authHeader() {
  const token = localStorage.getItem('token') || import.meta.env.VITE_ADMIN_TOKEN
  if (token) {
    return { Authorization: `Bearer ${token}` }
  } else {
    return {}
  }
}
