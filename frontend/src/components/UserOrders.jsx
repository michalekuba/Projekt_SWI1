import { useEffect, useState } from 'react';
import axios from 'axios';

const STATUS_LABELS = {
    NEW: 'Nová',
    PAID: 'Zaplacená',
    SHIPPED: 'Odeslaná',
    CANCELED: 'Zrušená'
};

const STATUS_BADGE_CLASSES = {
    NEW: 'bg-secondary',
    PAID: 'bg-success',
    SHIPPED: 'bg-primary',
    CANCELED: 'bg-danger'
};

const SHIPPING_LABELS = {
    ZASILKOVNA: 'Zásilkovna na výdejní místo',
    BALIKOVNA: 'Balíkovna na výdejní místo',
    PPL: 'PPL na adresu'
};

const UserOrders = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadOrders = () => {
        if (!user) return;
        setLoading(true);
        axios.get(`http://localhost:8080/api/orders/${user.id}`)
            .then(response => {
                setOrders(response.data);
                setError('');
            })
            .catch(err => {
                setError(err.response?.data || 'Objednávky se nepodařilo načíst.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadOrders();
    }, [user]);

    if (!user) return null;

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h3 className="card-title h5 mb-3">Moje objednávky</h3>
                {loading && <div>Načítám...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                {!loading && !error && orders.length === 0 && (
                    <div className="text-muted">Zatím nemáte žádné objednávky.</div>
                )}
                {!loading && !error && orders.length > 0 && (
                    <div className="d-grid gap-3">
                        {orders.map(order => (
                            <div key={order.id} className="border rounded p-3">
                                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                                    <div>
                                        <strong>Objednávka #{order.id}</strong>
                                        <div className="text-muted small">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleString('cs-CZ') : ''}
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className={`badge ${STATUS_BADGE_CLASSES[order.status] || 'bg-secondary'}`}>
                                            {STATUS_LABELS[order.status] || order.status}
                                        </div>
                                        <div className="fw-semibold mt-1">
                                            {Number(order.total).toLocaleString('cs-CZ')} Kč
                                        </div>
                                    </div>
                                </div>
                                <div className="text-muted small mb-2">
                                    {order.billingFirstName} {order.billingLastName} · {order.billingEmail} · {order.billingPhone}
                                </div>
                                <div className="text-muted small mb-2">
                                    {order.billingStreet}, {order.billingCity} {order.billingPostalCode}
                                </div>
                                <div className="text-muted small mb-3">
                                    Doprava: {SHIPPING_LABELS[order.shippingMethod] || order.shippingMethod}
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-sm mb-0">
                                        <thead>
                                        <tr>
                                            <th>Produkt</th>
                                            <th className="text-end">Množství</th>
                                            <th className="text-end">Cena</th>
                                            <th className="text-end">Celkem</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {order.items.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.productName}</td>
                                                <td className="text-end">{item.quantity}</td>
                                                <td className="text-end">{Number(item.priceAtOrder).toLocaleString('cs-CZ')} Kč</td>
                                                <td className="text-end">{Number(item.lineTotal).toLocaleString('cs-CZ')} Kč</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserOrders;

