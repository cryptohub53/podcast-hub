import axios from 'axios'


const axiosClient = axios.create({
    baseURL: "http://localhost:5000/api/v1",

    headers: {'Content-Type' : 'application/json'}
})

// axiosClient.interceptors.request.use(config => {
//     const token
// })

export default axiosClient