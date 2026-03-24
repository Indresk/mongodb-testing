// Expanders para actualización de productos

document.querySelector('#post-head').addEventListener('click', (e) => {
    const head = e.currentTarget;
    const expander = document.querySelector('#post-expander');
    
    head.classList.toggle('active');
    
    if (head.classList.contains('active')) {
        expander.style.display = 'inline-block';
    } else {
        expander.style.display = 'none';
    }
});

document.querySelector('#delete-head').addEventListener('click', (e) => {
    const head = e.currentTarget;
    const expander = document.querySelector('#delete-expander');
    
    head.classList.toggle('active');
    
    if (head.classList.contains('active')) {
        expander.style.display = 'inline-block';
    } else {
        expander.style.display = 'none';
    }
});