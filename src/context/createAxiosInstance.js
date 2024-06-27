import axios from 'axios'
const createAxiosInstance = () => {
  // const accessToken = window.localStorage.getItem('accessToken')
  let axiosInstance
  if (typeof window !== 'undefined') {
    // Code is running in a browser environment
    const accessToken = window.localStorage.getItem('accessToken')
 
    axiosInstance = axios.create({
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  } else {
    // Code is running in a non-browser environment (e.g., Node.js)
    axiosInstance = axios.create()
  }
  return axiosInstance
}
 
export default createAxiosInstance