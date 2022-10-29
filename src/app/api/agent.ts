//Axios & query configuration => easier to use inside the components! 
//---> uses an INTERCEPTOR either on the way out of a clients browser or the way back in;

import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = 'http://localhost:8080/commerce/api/public';
axios.defaults.withCredentials = true;

//Arrow function;
const responseBody = (response: AxiosResponse) => response.data; 

//Normal function:
// function responseBody(response: AxiosResponse) {
//     return response.data;
// }

axios.interceptors.response.use(response => {
    return response
}, (error: AxiosError) => {
    if (error.response) {
        const {data, status} = error.response;
    switch(status){
        case 400:
            toast.error("Bad request");
            break;

        case 401:
            toast.error("Unauthorized");
            break;
            
        case 500:
            toast.error("Internal server error");
            break;  

        default:
            break;      
    }
    return Promise.reject(error.response);
}
}) //must return the error from the interceptor! 
   //--> Axios can't catch and handle the errors, they have to be handled in the components!

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

const Catalog = {
    list: () => requests.get('catalog/products'),
    details: (id: number) => requests.get(`catalog/product/${id}`)
}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error')
}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`basket`, { productId, quantity }),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket/${productId}/${quantity}`),
}

const agent = {
    Catalog,
    TestErrors,
    Basket
}

export default agent;