import axios from 'axios';

export function call(method, url, headers, body) {
    return axios({
        method,
        url,
        headers,
        data: body
    })
    .then(response => response.data)
    .catch(error => {
        console.error('API call error:', error);
        throw error; // This will be handled by the caller of this function
    });
}
