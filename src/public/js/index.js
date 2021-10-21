import '@babel/polyfill';
import {login, logout} from './login';
import {updateSettings} from './updateSettings';
import {signup} from './signup';

console.log('bonjour');

const btnMenu = document.querySelector(".btn-rond-menu");
const nav = document.querySelector('.nav');
const ligne = document.querySelector('.cont-ligne');

btnMenu.addEventListener("click", () => {
    ligne.classList.toggle("active");
    nav.classList.toggle("menu-visible");
})

const loginForm = document.querySelector('.form-signin');
const logOutBtn = document.querySelector('.nav-logout');
const userDataForm = document.querySelector('.form-user-update');
const userPasswordForm = document.querySelector('.form-update-password');
const singupForm = document.querySelector('.form-signup');

if(singupForm)
    singupForm.addEventListener('submit', async e => {
        e.preventDefault();

        const name = document.querySelector('#name').value;
        const lastName = document.querySelector('#lastName').value;
        const birthday = document.querySelector('#birthday').value;
        const email = document.querySelector('#email').value;
        const numberOfStreet = document.querySelector('#numberOfStreet').value;
        const nameOfStreet = document.querySelector('#nameOfStreet').value;
        const zipCode = document.querySelector('#zipcode').value;
        const password = document.querySelector('#password').value;
        const passwordConfirm = document.querySelector('#passwordConfirm').value;

        await signup(name, lastName, birthday, email, numberOfStreet, nameOfStreet, zipCode, password, passwordConfirm);

    });

if(loginForm)
    loginForm.addEventListener('submit', e => {
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        console.log(email , password);
        e.preventDefault();

        login(email, password);
    });


if(logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
    userDataForm.addEventListener('submit', async e => {
        e.preventDefault();
        const email = document.querySelector('#email').value;
        const numberOfStreet = document.querySelector('#numberOfStreet').value;
        const nameOfStreet = document.querySelector('#nameOfStreet').value;
        const zipCode = document.querySelector('#zipcode').value;

        await updateSettings({email, numberOfStreet, nameOfStreet, zipCode}, 'data');
    })

if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        const passwordCurrent = document.querySelector('#passwordCurrent').value;
        const Password = document.querySelector('#Password').value;
        const passwordConfirm = document.querySelector('#passwordConfirm').value;
       

        await updateSettings({passwordCurrent, Password, passwordConfirm}, 'password');

        document.querySelector('.btn-save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    })