import { useEffect, useState } from 'react';
import axios from 'axios';

const BillingProfile = ({ user, onProfileUpdated }) => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        postalCode: '',
        email: '',
        phone: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;
        setForm({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            street: user.street || '',
            city: user.city || '',
            postalCode: user.postalCode || '',
            email: user.email || '',
            phone: user.phone || ''
        });
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        axios.put(`http://localhost:8080/api/users/${user.id}/profile`, form)
            .then(response => {
                setMessage('Fakturační údaje byly uloženy.');
                onProfileUpdated?.(response.data);
            })
            .catch(err => {
                setError(err.response?.data || 'Uložení selhalo.');
            });
    };

    if (!user) return null;

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h3 className="card-title h5 mb-3">Fakturační údaje</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Jméno</label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            value={form.firstName}
                            onChange={e => setForm({ ...form, firstName: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Příjmení</label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            value={form.lastName}
                            onChange={e => setForm({ ...form, lastName: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Ulice</label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            value={form.street}
                            onChange={e => setForm({ ...form, street: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Město</label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            value={form.city}
                            onChange={e => setForm({ ...form, city: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">PSČ</label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            value={form.postalCode}
                            onChange={e => setForm({ ...form, postalCode: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">E-mail</label>
                        <input
                            type="email"
                            className="form-control"
                            required
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Telefon</label>
                        <input
                            type="tel"
                            className="form-control"
                            required
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-outline-primary w-100">
                        Uložit údaje
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BillingProfile;
