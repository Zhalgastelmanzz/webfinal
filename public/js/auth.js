document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            alert('Login successful!');
            window.location.href = '/index.html'; 
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (err) {
        console.error('Auth error:', err);
        alert('Server connection error');
    }
});


document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password })
        });

        const data = await res.json(); 

        if (res.ok) {
            alert('Registration successful! Please login.');
            location.reload(); 
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (err) {
        console.error('Reg error:', err);
        alert('Server connection error');
    }
});