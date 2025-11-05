// Auth Module - Handles user authentication

// Current user state
let currentUser = null;

// DOM Elements
const authScreen = document.getElementById('authScreen');
const app = document.getElementById('app');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const registerUsername = document.getElementById('registerUsername');
const registerPassword = document.getElementById('registerPassword');

// Initialize Auth
function initAuth() {
    console.log('=== INIT AUTH START ===');

    // Check if Firebase is loaded
    if (!window.auth || !window.database) {
        console.error('❌ Firebase not loaded! Check your internet connection and Firebase configuration.');
        if (window.showNotification) {
            window.showNotification('Ошибка загрузки Firebase. Проверьте подключение к интернету.', 'error');
        }
        return;
    }

    console.log('✅ Firebase is available');

    // Check if user is already logged in
    window.onAuthStateChanged(window.auth, (user) => {
        console.log('🔄 Auth state changed:', user ? 'logged in' : 'logged out');
        if (user) {
            currentUser = user;
            console.log('👤 User logged in:', user.uid);
            showApp();
            // Initialize chat after auth
            if (typeof window.initChat === 'function') {
                console.log('🎯 Initializing chat...');
                window.initChat();
            } else {
                console.error('❌ initChat function not found');
            }
        } else {
            currentUser = null;
            console.log('🚪 User logged out');
            showAuth();
        }
    });

    console.log('🎧 Setting up event listeners...');
    setupEventListeners();
    console.log('✅ Auth initialization complete');
}

// Setup Event Listeners
function setupEventListeners() {
    console.log('🎧 Setting up auth event listeners...');

    // Get elements again (in case they weren't available before)
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const registerUsername = document.getElementById('registerUsername');
    const registerPassword = document.getElementById('registerPassword');

    // Check if elements exist
    console.log('🔍 Elements check:', {
        loginBtn: !!loginBtn,
        registerBtn: !!registerBtn,
        showRegister: !!showRegister,
        showLogin: !!showLogin,
        loginUsername: !!loginUsername,
        loginPassword: !!loginPassword,
        registerUsername: !!registerUsername,
        registerPassword: !!registerPassword
    });

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            console.log('🔵 Login button clicked');
            e.preventDefault();
            handleLogin();
        });
        console.log('✅ Login button listener added');
    } else {
        console.error('❌ loginBtn not found!');
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            console.log('🟢 Register button clicked');
            e.preventDefault();
            handleRegister();
        });
        console.log('✅ Register button listener added');
    } else {
        console.error('❌ registerBtn not found!');
    }

    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔄 Show register form clicked');
            showRegisterForm();
        });
        console.log('✅ Show register listener added');
    } else {
        console.error('❌ showRegister not found!');
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔄 Show login form clicked');
            showLoginForm();
        });
        console.log('✅ Show login listener added');
    } else {
        console.error('❌ showLogin not found!');
    }

    // Enter key handlers
    if (loginUsername) {
        loginUsername.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('⌨️ Enter pressed on username');
                if (loginPassword) loginPassword.focus();
            }
        });
    }

    if (loginPassword) {
        loginPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('⌨️ Enter pressed on login password');
                handleLogin();
            }
        });
    }

    if (registerUsername) {
        registerUsername.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('⌨️ Enter pressed on register username');
                if (registerPassword) registerPassword.focus();
            }
        });
    }

    if (registerPassword) {
        registerPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('⌨️ Enter pressed on register password');
                handleRegister();
            }
        });
    }

    console.log('✅ Auth event listeners setup complete');
}

// Handle Login
async function handleLogin() {
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (!username || !password) {
        showNotification('Заполните все поля', 'error');
        return;
    }

    try {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Вход...';

        // Create email from username for Firebase Auth
        const email = `${username}@chatbyfan.local`;

        await window.signInWithEmailAndPassword(window.auth, email, password);

        showNotification('Вход выполнен успешно', 'success');

    } catch (error) {
        console.error('Login error:', error);
        let message = 'Ошибка входа';

        switch (error.code) {
            case 'auth/user-not-found':
                message = 'Пользователь не найден';
                break;
            case 'auth/wrong-password':
                message = 'Неверный пароль';
                break;
            case 'auth/invalid-email':
                message = 'Неверный формат имени пользователя';
                break;
            case 'auth/user-disabled':
                message = 'Аккаунт заблокирован';
                break;
        }

        showNotification(message, 'error');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Войти';
    }
}

// Handle Register
async function handleRegister() {
    const username = registerUsername.value.trim();
    const password = registerPassword.value.trim();

    if (!username || !password) {
        showNotification('Заполните все поля', 'error');
        return;
    }

    if (username.length < 3) {
        showNotification('Имя пользователя должно содержать минимум 3 символа', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Пароль должен содержать минимум 6 символов', 'error');
        return;
    }

    try {
        registerBtn.disabled = true;
        registerBtn.textContent = 'Регистрация...';

        // Create email from username for Firebase Auth
        const email = `${username}@chatbyfan.local`;

        // Create user account
        const userCredential = await window.createUserWithEmailAndPassword(window.auth, email, password);
        const user = userCredential.user;

        // Save user profile to database
        await window.set(window.dbRef(window.database, `users/${user.uid}`), {
            uid: user.uid,
            displayName: username,
            username: username,
            email: email,
            createdAt: Date.now(),
            lastSeen: Date.now(),
            online: true,
            avatar: null
        });

        showNotification('Регистрация выполнена успешно', 'success');

    } catch (error) {
        console.error('Register error:', error);
        let message = 'Ошибка регистрации';

        switch (error.code) {
            case 'auth/email-already-in-use':
                message = 'Это имя пользователя уже занято';
                break;
            case 'auth/weak-password':
                message = 'Пароль слишком слабый';
                break;
            case 'auth/invalid-email':
                message = 'Неверный формат имени пользователя';
                break;
        }

        showNotification(message, 'error');
    } finally {
        registerBtn.disabled = false;
        registerBtn.textContent = 'Создать аккаунт';
    }
}

// Handle Logout
async function handleLogout() {
    try {
        // Update user status before logout
        if (currentUser) {
            await window.update(window.dbRef(window.database, `users/${currentUser.uid}`), {
                online: false,
                lastSeen: Date.now()
            });
        }

        await window.signOut(window.auth);
        showNotification('Выход выполнен', 'success');

    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Ошибка выхода', 'error');
    }
}

// Show Auth Screen
function showAuth() {
    authScreen.style.display = 'flex';
    app.style.display = 'none';
}

// Show App
function showApp() {
    authScreen.style.display = 'none';
    app.style.display = 'flex';
}

// Show Register Form
function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    registerUsername.focus();
}

// Show Login Form
function showLoginForm() {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    loginUsername.focus();
}

// Get Current User
function getCurrentUser() {
    return currentUser;
}

// Update User Status
async function updateUserStatus(online) {
    if (!currentUser) return;

    try {
        await window.update(window.dbRef(window.database, `users/${currentUser.uid}`), {
            online: online,
            lastSeen: online ? null : Date.now()
        });
    } catch (error) {
        console.error('Error updating user status:', error);
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        maxWidth: '300px',
        wordWrap: 'break-word',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        animation: 'slideIn 0.3s ease-out'
    });

    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#4caf50';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ff9800';
            break;
        default:
            notification.style.backgroundColor = '#2196f3';
    }

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);

    // Add slideOut animation
    style.textContent += `
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
}

// Export functions
window.initAuth = initAuth;
window.getCurrentUser = getCurrentUser;
window.handleLogout = handleLogout;
window.updateUserStatus = updateUserStatus;
window.showNotification = showNotification;