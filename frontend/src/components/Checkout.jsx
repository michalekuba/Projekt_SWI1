import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const SHIPPING_OPTIONS = [
    { id: 'zasilkovna', label: 'Zásilkovna na výdejní místo', pickup: true },
    { id: 'balikovna', label: 'Balíkovna na výdejní místo', pickup: true },
    { id: 'ppl', label: 'PPL na adresu', pickup: false }
];

const Checkout = ({ user, onOrderPlaced }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [useProfile, setUseProfile] = useState(true);
    const [shippingMethod, setShippingMethod] = useState('zasilkovna');
    const [billingForm, setBillingForm] = useState({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        postalCode: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        axios.get(`http://localhost:8080/api/cart/${user.id}`)
            .then(response => {
                setCart(response.data);
                setError('');
                setMessage('');
                setBillingForm({
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                    street: user?.street || '',
                    city: user?.city || '',
                    postalCode: user?.postalCode || '',
                    email: user?.email || '',
                    phone: user?.phone || ''
                });
            })
            .catch(err => {
                setError(err.response?.data || 'Košík se nepodařilo načíst.');
            })
            .finally(() => setLoading(false));
    }, [user]);

    const selectedShipping = useMemo(
        () => SHIPPING_OPTIONS.find(option => option.id === shippingMethod),
        [shippingMethod]
    );

    const handleOrder = () => {
        if (!cart || !cart.items || cart.items.length === 0) {
            setError('Košík je prázdný.');
            return;
        }
        setError('');
        setMessage('');
        const payload = useProfile ? { useProfile: true } : {
            useProfile: false,
            firstName: billingForm.firstName,
            lastName: billingForm.lastName,
            street: billingForm.street,
            city: billingForm.city,
            postalCode: billingForm.postalCode,
            email: billingForm.email,
            phone: billingForm.phone
        };
        payload.shippingMethod = shippingMethod.toUpperCase();
        axios.post(`http://localhost:8080/api/orders/${user.id}/from-cart`, payload)
            .then(() => {
                setMessage('Objednávka byla vytvořena.');
                onOrderPlaced?.();
            })
            .catch(err => {
                setError(err.response?.data || 'Vytvoření objednávky selhalo.');
            });
    };

    if (!user) return null;

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h3 className="card-title h5 mb-3">Dokončení objednávky</h3>
                {loading && <div>Načítám...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                {!loading && cart && (
                    <div className="mb-4">
                        <div className="fw-semibold">Souhrn</div>
                        <div className="text-muted small">Položek: {cart.items.length}</div>
                        <div className="fw-semibold">Celkem: {Number(cart.total).toLocaleString('cs-CZ')} Kč</div>
                    </div>
                )}

                <div className="border rounded p-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="fw-semibold">Fakturační údaje</div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="useProfileBilling"
                                checked={useProfile}
                                onChange={e => setUseProfile(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="useProfileBilling">
                                Použít uložené
                            </label>
                        </div>
                    </div>
                    {useProfile ? (
                        <div className="text-muted small">
                            <div>{billingForm.firstName} {billingForm.lastName}</div>
                            <div>{billingForm.street}, {billingForm.city} {billingForm.postalCode}</div>
                            <div>{billingForm.email}</div>
                            <div>{billingForm.phone}</div>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-2">
                                <label className="form-label">Jméno</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={billingForm.firstName}
                                    onChange={e => setBillingForm({ ...billingForm, firstName: e.target.value })}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Příjmení</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={billingForm.lastName}
                                    onChange={e => setBillingForm({ ...billingForm, lastName: e.target.value })}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Ulice</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={billingForm.street}
                                    onChange={e => setBillingForm({ ...billingForm, street: e.target.value })}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Město</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={billingForm.city}
                                    onChange={e => setBillingForm({ ...billingForm, city: e.target.value })}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">PSČ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={billingForm.postalCode}
                                    onChange={e => setBillingForm({ ...billingForm, postalCode: e.target.value })}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">E-mail</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={billingForm.email}
                                    onChange={e => setBillingForm({ ...billingForm, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="form-label">Telefon</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={billingForm.phone}
                                    onChange={e => setBillingForm({ ...billingForm, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="border rounded p-3 mb-4">
                    <div className="fw-semibold mb-2">Doprava</div>
                    {SHIPPING_OPTIONS.map(option => (
                        <div key={option.id} className="form-check mb-2">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="shipping"
                                id={`shipping-${option.id}`}
                                value={option.id}
                                checked={shippingMethod === option.id}
                                onChange={e => setShippingMethod(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor={`shipping-${option.id}`}>
                                {option.label}
                            </label>
                        </div>
                    ))}
                    {selectedShipping?.pickup && (
                        <button type="button" className="btn btn-outline-secondary btn-sm">
                            Vybrat výdejní místo
                        </button>
                    )}
                </div>

                <button className="btn btn-success w-100" type="button" onClick={handleOrder}>
                    Odeslat objednávku
                </button>
            </div>
        </div>
    );
};

export default Checkout;

