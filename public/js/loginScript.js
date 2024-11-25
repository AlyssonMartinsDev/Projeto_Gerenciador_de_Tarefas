window.onload = function () {
    const token = localStorage.getItem('token')
    if (token) {
        window.location.href = '/dashboard'
    }
}

async function login(email, password) {
    try {

        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            document.getElementById('errorMessage').textContent = data.error
            return
        }

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data))
        window.location.href = "/dashboard"


    } catch (error) {
        console.error('Erro ao fazer login:', error);
    }


}

document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(username, password);
});
