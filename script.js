const request = {
    async get(url, cb) {
        try {
            let response = await fetch(url);

            response = await response.json();

            cb(response)
        } catch (e) {
            console.log(e)
        }
    },
    async post(url, body, cb) {
        try {
            let response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });

            response = await response.json()

            cb(response)
        }
        catch (e) {
            console.log(e)
        }
    }
};

const button = document.querySelector('.button');
const div = document.querySelector('.div');
const userInfoContainer = document.querySelector('.infoUser');
const form = document.querySelector('.form');
let objOfUsers = {};

// Inputs
const nameInput = document.querySelector('#name');
const userNameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const phoneInput = document.querySelector('#phone');


// Events
button.addEventListener('click', getUserList);
div.addEventListener('click', getUserInfo);
form.addEventListener('submit', onSubmit);

function getUserList() {
    request.get('https://jsonplaceholder.typicode.com/users', getUsers);

    button.removeEventListener('click', getUserList)
}

function getUsers(users) {
    objOfUsers = users.reduce((acc, el) => {
        acc[el.id] = el;
        return acc
    }, {});

    renderUsersName(objOfUsers);
    console.log(objOfUsers)
}


function renderUsersName(users) {
    let fragment = document.createDocumentFragment();

    Object.values(users).forEach((user) => {
        let p = createParagraphTemplate(user);
        fragment.appendChild(p);
    });

    div.appendChild(fragment)

}

function createParagraphTemplate({name, id}) {
    const p = document.createElement('p');
    p.textContent = name;
    p.setAttribute('data-user-id', id);
    p.className = 'user';
    // console.log(p);
    return p
}

function getUserInfo({target, currentTarget}) {
    if (target === currentTarget) return;

    const userId = target.getAttribute('data-user-id');
    console.log(userId);
    renderUserInfo(objOfUsers[userId])

}

function renderUserInfo(user) {
    userInfoContainer.style.display = 'block';
    const userInfoFragment = createUserInfoTemplate(user);

    userInfoContainer.innerHTML = '';
    userInfoContainer.appendChild(userInfoFragment);
}

function createUserInfoTemplate({name, username, email, phone}) {
    const fragment = document.createDocumentFragment();

    const nameInfo = document.createElement('p');
    nameInfo.textContent = `name: ${name}`;

    const userNameInfo = document.createElement('p');
    userNameInfo.textContent = `username: ${username}`;

    const emailInfo = document.createElement('p');
    emailInfo.textContent = `email: ${email}`;

    const phoneInfo = document.createElement('p');
    phoneInfo.textContent = `phone: ${phone}`;

    fragment.appendChild(nameInfo);
    fragment.appendChild(userNameInfo);
    fragment.appendChild(emailInfo);
    fragment.appendChild(phoneInfo);

    return fragment
}


function onSubmit(event) {
    event.preventDefault();

    const body = getDataNewUser();

    request.post('https://jsonplaceholder.typicode.com/posts', body, setNewUser)
}

function getDataNewUser() {
    const newUser = {
        name: nameInput.value,
        username: userNameInput.value,
        email: emailInput.value,
        phone: phoneInput.value
    };

    form.reset()


    return newUser
}

function setNewUser(newUser) {
    newUser.id = Math.random();

    objOfUsers[newUser.id] = newUser;

    const p = createParagraphTemplate(newUser)

    div.appendChild(p)
}


