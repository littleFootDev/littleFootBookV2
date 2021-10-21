import axios from "axios";
import {showAlert} from './alerts';


export const updateSettings = async (data, type) => {
    try {

        const url = type === 'password' ? '/users/updateMyPassword' : '/users/updateMe'

        const res = await axios({
            method : 'PATCH',
            url, 
            data 
        });

        if(res.data.status === 'success') {
            showAlert('success',`${type.toUpperCase()}`, 'Mise à jour successé');
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}