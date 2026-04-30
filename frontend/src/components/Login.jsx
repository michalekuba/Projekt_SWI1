import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/auth/login', credentials)
            .then(response => {
                onLoginSuccess(response.data); // Předáme data uživatele do App.jsx
                setError('');
            })
            .catch(err => {
                setError('Špatné jméno nebo heslo');
            });
    };

    return (
        <div className="card shadow-sm mx-auto" style={{maxWidth: '400px'}}>
            <div className="card-body">
                <h3 className="card-title text-center mb-4">Přihlášení</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Uživatelské jméno</label>
                        <input
                            type="text" className="form-control" required
                            onChange={e => setCredentials({...credentials, username: e.target.value})}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Heslo</label>
                        <input
                            type="password" className="form-control" required
                            onChange={e => setCredentials({...credentials, password: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Přihlásit se</button>
                </form>
            </div>
        </div>
    );
};

export default Login;