import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = ({ user, refreshKey, onCartChanged }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [quantityEdits, setQuantityEdits] = useState({});

    const loadCart = () => {
        if (!user) return;
        setLoading(true);
        axios.get(`http://localhost:8080/api/cart/${user.id}`)
            .then(response => {
                setCart(response.data);
                setQuantityEdits({});
                setError('');
            })
            .catch(err => {
                setError(err.response?.data || 'Kosik se nepodarilo nacist.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadCart();
    }, [user, refreshKey]);

    const handleQuantityChange = (itemId, value) => {
        setQuantityEdits(prev => ({ ...prev, [itemId]: value }));
    };

    const handleQuantitySave = (itemId) => {
        const quantity = Number(quantityEdits[itemId]);
        if (!Number.isInteger(quantity) || quantity < 0) {
            alert('Zadejte nezaporne cele cislo.');
            return;
        }

        axios.patch(`http://localhost:8080/api/cart/${user.id}/items/${itemId}`, { quantity })
            .then(() => {
                onCartChanged?.();
            })
            .catch(err => {
                alert(err.response?.data || 'Ulozeni mnozstvi selhalo.');
            });
    };

    const handleRemove = (itemId) => {
        axios.delete(`http://localhost:8080/api/cart/${user.id}/items/${itemId}`)
            .then(() => {
                onCartChanged?.();
            })
            .catch(err => {
                alert(err.response?.data || 'Odebrani polozky selhalo.');
            });
    };

    if (!user) return null;

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h3 className="card-title h5 mb-3">Kosik</h3>
                {loading && <div>Loading...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                {!loading && !error && (!cart || cart.items.length === 0) && (
                    <div className="text-muted">Kosik je prazdny.</div>
                )}
                {!loading && !error && cart && cart.items.length > 0 && (
                    <div>
                        {cart.items.map(item => (
                            <div key={item.id} className="border-bottom pb-2 mb-2">
                                <div className="fw-semibold">{item.productName}</div>
                                <div className="text-muted small">
                                    {Number(item.price).toLocaleString('cs-CZ')} Kč / ks
                                </div>
                                <div className="input-group input-group-sm mt-2">
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="0"
                                        value={quantityEdits[item.id] ?? item.quantity}
                                        onChange={e => handleQuantityChange(item.id, e.target.value)}
                                    />
                                    <button
                                        className="btn btn-outline-success"
                                        type="button"
                                        onClick={() => handleQuantitySave(item.id)}
                                    >
                                        Ulozit
                                    </button>
                                    <button
                                        className="btn btn-outline-danger"
                                        type="button"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        Odebrat
                                    </button>
                                </div>
                                <div className="text-end text-muted small mt-1">
                                    {Number(item.lineTotal).toLocaleString('cs-CZ')} Kč
                                </div>
                            </div>
                        ))}
                        <div className="d-flex justify-content-between fw-semibold mt-3">
                            <span>Celkova cena</span>
                            <span>{Number(cart.total).toLocaleString('cs-CZ')} Kč</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;

