import '@babel/polyfill'
import axios from "axios";
import {showAlert} from './alerts';

export const signup = async (name, lastName, birthday,email, numberOfStreet, nameOfStreet, zipCode,   password, passwordConfirm) => {
    try {
        const res = await axios({
            method : 'POST',
            url : '/users/login',
            data : { 
                name,
                lastName,
                birthday,
                email, 
                numberOfStreet,
                nameOfStreet,
                zipCode,
                password,
                passwordConfirm,
                withCredentials: true
            }
        });

        if(res.data.status === 'success') {
            showAlert('success', 'Insciption réussi');
            window.setTimeout(() =>{
                location.assign('/');
            }, 1500);
        }
    
    } catch (err) {
        showAlert('error',err.response.data.message);
    }
};