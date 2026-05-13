const AUTH_USERS_KEY = 'hoopstartUsers';
const AUTH_CURRENT_KEY = 'hoopstartCurrentUser';

function getUsers() {
    const stored = localStorage.getItem(AUTH_USERS_KEY);
    return stored ? JSON.parse(stored) : {};
}

function setUsers(users) {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
    const stored = localStorage.getItem(AUTH_CURRENT_KEY);
    return stored ? JSON.parse(stored) : null;
}

function setCurrentUser(user) {
    localStorage.setItem(AUTH_CURRENT_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem(AUTH_CURRENT_KEY);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderNavActions() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    const currentUser = getCurrentUser();
    if (currentUser) {
        navActions.innerHTML = `
            <span class="nav-user">Hi, ${escapeHtml(currentUser.username)}</span>
            <a href="#" id="logout-link">Logout</a>
        `;

        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', (event) => {
                event.preventDefault();
                clearCurrentUser();
                window.location.href = 'index.html';
            });
        }
    } else {
        navActions.innerHTML = `
            <a href="signin.html">Sign In</a>
            <a class="btn-signup" href="signup.html">Sign Up</a>
        `;
    }
}

function initSignupForm() {
    const signupForm = document.querySelector('#signup-form');
    if (!signupForm) return;

    const existingUser = getCurrentUser();
    if (existingUser) {
        window.location.href = 'index.html';
        return;
    }

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(signupForm);
        const username = formData.get('username').trim();
        const email = formData.get('email').trim();
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (!username || !password) {
            alert('Please enter a username and password.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const users = getUsers();
        if (users[username]) {
            alert('Username already exists. Please choose another one.');
            return;
        }

        users[username] = {
            username,
            email,
            password,
        };
        setUsers(users);
        setCurrentUser({ username });
        window.location.href = 'index.html';
    });
}

function initSigninForm() {
    const signinForm = document.querySelector('#signin-form');
    if (!signinForm) return;

    const currentUser = getCurrentUser();
    if (currentUser) {
        window.location.href = 'index.html';
        return;
    }

    signinForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(signinForm);
        const username = formData.get('username').trim();
        const password = formData.get('password');

        const users = getUsers();
        if (!users[username] || users[username].password !== password) {
            alert('Wrong username or password.');
            return;
        }

        setCurrentUser({ username });
        window.location.href = 'index.html';
    });
}

function initAuth() {
    renderNavActions();
    initSigninForm();
    initSignupForm();
}

window.addEventListener('DOMContentLoaded', initAuth);
