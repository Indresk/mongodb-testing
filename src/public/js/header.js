const currentURL = window.location.pathname;

const currentNavLinks = document.querySelector('nav').querySelectorAll('a');

currentNavLinks.forEach(element => {
    if(element.pathname === currentURL)element.classList.add('active')
});

