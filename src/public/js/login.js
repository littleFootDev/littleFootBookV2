import '@babel/polyfill'
import axios from "axios";
import {showAlert} from './Alert';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method : 'POST',
            url : '/users/login',
            data : { 
                email, 
                password,
                withCredentials: true
            }
        });

        if(res.data.status === 'success') {
            showAlert('success', 'Connection réussi');
            window.setTimeout(() =>{
                location.assign('/catalogue');
            }, 1500);
        }
    
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

