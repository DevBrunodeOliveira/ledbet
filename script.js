// Modal open and close handlers
const loginBtn = document.getElementById('loginBtn');
const signUpBtn = document.getElementById('signUpBtn');
const loginModal = document.getElementById('loginModal');
const signUpModal = document.getElementById('signUpModal');
const closeLoginBtn = document.getElementById('closeLoginBtn');
const closeSignUpBtn = document.getElementById('closeSignUpBtn');

// User info elements
const authButtons = document.querySelector('.auth-buttons');
const userInfo = document.querySelector('.user-info');
const userNameSpan = userInfo.querySelector('.name');
const userBalanceSpan = userInfo.querySelector('.balance');

// Open modals
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
    loginModal.focus();
});
signUpBtn.addEventListener('click', () => {
    signUpModal.classList.add('active');
    signUpModal.focus();
});

// Close modals
closeLoginBtn.addEventListener('click', () => {
    loginModal.classList.remove('active');
});
closeSignUpBtn.addEventListener('click', () => {
    signUpModal.classList.remove('active');
});

// Close when clicking outside modal content
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
    }
});
signUpModal.addEventListener('click', (e) => {
    if (e.target === signUpModal) {
        signUpModal.classList.remove('active');
    }
});

// Close on Escape key press
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (loginModal.classList.contains('active')) {
            loginModal.classList.remove('active');
        }
        if (signUpModal.classList.contains('active')) {
            signUpModal.classList.remove('active');
        }
    }
});

// Login form submit handler (simulate login)
document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = e.target.loginEmail.value.trim();
    const password = e.target.loginPassword.value;
    if (email.toLowerCase() === 'ledsom' && password === '123') {
        // Successful login simulation
        loginModal.classList.remove('active');
        authButtons.style.display = 'none';
        userNameSpan.textContent = 'Ledsom';
        userBalanceSpan.textContent = 'R$1,000';
        userInfo.style.display = 'flex';
    } else {
        alert('Invalid email or password. Try "ledsom" and "123".');
    }
});

// Sign up submit placeholder (no change)
document.getElementById('signUpForm').addEventListener('submit', e => {
    e.preventDefault();
    alert('Account creation submitted! Feature coming soon.');
    signUpModal.classList.remove('active');
});


