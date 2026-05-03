import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [mode, setMode] = useState('login');
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [registerData, setRegisterData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        postalCode: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setSuccess('');
        axios.post('http://localhost:8080/api/auth/login', credentials)
            .then(response => {
                onLoginSuccess(response.data); // Předáme data uživatele do App.jsx
                setError('');
            })
            .catch(err => {
                setError('Špatné jméno nebo heslo');
            });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');
        if (registerData.password !== registerData.confirmPassword) {
            setError('Hesla se neshodují.');
            return;
        }
        const { confirmPassword, ...payload } = registerData;
        axios.post('http://localhost:8080/api/auth/register', payload)
            .then(response => {
                setSuccess('Registrace proběhla úspěšně.');
                onLoginSuccess(response.data);
            })
            .catch(err => {
                const message = err.response?.data || 'Registrace se nezdařila.';
                setError(message);
            });
    };

    return (
        <div className="card shadow-sm mx-auto" style={{maxWidth: '400px'}}>
            <div className="card-body">
                <div className="btn-group w-100 mb-3" role="group">
                    <button
                        type="button"
                        className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                    >
                        Přihlášení
                    </button>
                    <button
                        type="button"
                        className={`btn ${mode === 'register' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                    >
                        Registrace
                    </button>
                </div>
                <h3 className="card-title text-center mb-4">
                    {mode === 'login' ? 'Přihlášení' : 'Registrace'}
                </h3>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {mode === 'login' ? (
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
                ) : (
                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label className="form-label">Uživatelské jméno</label>
                            <input
                                type="text" className="form-control" required
                                onChange={e => setRegisterData({...registerData, username: e.target.value})}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">E-mail</label>
                            <input
                                type="email" className="form-control" required
                                onChange={e => setRegisterData({...registerData, email: e.target.value})}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Jméno</label>
                            <input
                                type="text" className="form-control" required
                                onChange={e => setRegisterData({...registerData, firstName: e.target.value})}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Příjmení</label>
                            <input
                                type="text" className="form-control" required
                                onChange={e => setRegisterData({...registerData, lastName: e.target.value})}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Ulice</label>
                            <input
                                type="text" className="form-control" required
                                onChange={e => setRegisterData({...registerData, street: e.target.value})}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Město</label>
                            <input
                                type="text" className="form-control" required
                                onChange={e => setRegisterData({...registerData, city: e.target.value})}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">PSČ</label>
                            <input
                                type="text" className="form-control" required
                                onChange={e => setRegisterData({...registerData, postalCode: e.target.value})}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Telefon</label>
                            <input
                                type="tel" className="form-control" required
                                onChange={e => setRegisterData({...registerData, phone: e.target.value})}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Heslo</label>
                            <input
                                type="password" className="form-control" required
                                onChange={e => setRegisterData({...registerData, password: e.target.value})}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Potvrzení hesla</label>
                            <input
                                type="password" className="form-control" required
                                onChange={e => setRegisterData({...registerData, confirmPassword: e.target.value})}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Zaregistrovat se</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;