import { response } from "express";

console.log('Hello World')

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const woofElement = document.querySelector('.woof')
const API_URL = 'http://localhost:5000/woof';

loadingElement.style.display = 'none';

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');
    const woof = {
        name, content
    };

    form.style.display = 'none';
    loadingElement.style.display = '';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(woof),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
        .then(createdWoof => {
            form.reset();
            setTimeout(() => {
                form.style.display = '';
            }, 30000);

            listAllWoof();
        })
});

function listAllWoof() {
    woofElement.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(woof => {
            woof.reverse();
            woof.forEach(woof => {
                const div = document.createElement('div');

                const header = document.createElement('h3');
                header.textContent = woof.name;

                const content = document.createElement('p');
                content.textContent = mew.content;

                const date = document.createElement('small');
                date.textContent = new Date(woof.created);

                div.appendChild(header);
                div.appendChild(content);
                div.appendChild(date);

                woofElement.appendChild(div);
            });
            loadingElement.style.display = 'none';
        })
}