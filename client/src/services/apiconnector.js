// import axios from "axios";

// const API_BASE_URL = "http://localhost:4000"; // ✅ Your backend server

// export const apiConnector = async (method, url, bodyData = null, headers = {}) => {
//   try {
//     const config = {
//       method: method,
//       url: `${API_BASE_URL}${url}`, // ✅ Fix the malformed URL here
//       headers: headers,
//     };

//     if (method !== "GET" && bodyData) {
//       config.data = bodyData;
//     }

//     const response = await axios(config);
//     return response;
//   } catch (error) {
//     console.error("API Connector Error:", error);
//     throw error;
//   }
// };
import axios from "axios"

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers: null,
        params: params ? params : null,
    });
}