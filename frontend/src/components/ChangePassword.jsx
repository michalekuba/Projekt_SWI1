import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = ({ user }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Nové heslo a potvrzení se neshodují.');
            return;
        }

        axios.post('http://localhost:8080/api/auth/change-password', {
            userId: user.id,
            currentPassword,
            newPassword
        })
            .then(() => {
                setMessage('Heslo bylo změněno.');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            })
            .catch(err => {
                setError(err.response?.data || 'Změna hesla selhala.');
            });
    };

    if (!user) return null;

    return (
        <div className="card shadow-sm mb-4 form-card">
            <div className="card-body">
                <h3 className="card-title h5 mb-3">Změna hesla</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Aktuální heslo</label>
                        <input
                            type="password"
                            className="form-control"
                            required
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nové heslo</label>
                        <input
                            type="password"
                            className="form-control"
                            required
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Potvrzení nového hesla</label>
                        <input
                            type="password"
                            className="form-control"
                            required
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-outline-primary w-100">
                        Změnit heslo
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
