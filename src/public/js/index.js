import {login, logout} from './login';

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


if(loginForm)
    loginForm.addEventListener('submit', e => {
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        console.log(email , password);
        e.preventDefault();

        login(email, password);
    });


if(logOutBtn) logOutBtn.addEventListener('click', logout);