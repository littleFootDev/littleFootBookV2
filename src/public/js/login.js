import '@babel/polyfill'
import axios from "axios";
import {showAlert} from './alerts';

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
        showAlert('error',err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method : 'GET',
            url: '/users/logout',
            withCredentials: true
        });

        if(res.data.status === 'success') location.reload(true);

    } catch (err) {
        showAlert('error', 'Error logging out! Try again');
    }
}