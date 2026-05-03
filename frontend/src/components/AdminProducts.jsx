import { useEffect, useState } from 'react';
import axios from 'axios';
import AddProductForm from './AddProductForm';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stockEdits, setStockEdits] = useState({});

    const loadProducts = () => {
        axios.get('http://localhost:8080/api/products')
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Chyba při komunikaci s backendem:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = (id) => {
        if (!window.confirm('Opravdu chcete smazat tento produkt?')) return;
        axios.delete(`http://localhost:8080/api/products/${id}`)
            .then(() => loadProducts())
            .catch(error => console.error('Chyba při mazání:', error));
    };

    const handleStockChange = (id, value) => {
        setStockEdits(prev => ({ ...prev, [id]: value }));
    };

    const handleStockSave = (id) => {
        const stockQuantity = Number(stockEdits[id]);
        if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
            alert('Zadejte nezáporné celé číslo.');
            return;
        }
        axios.patch(`http://localhost:8080/api/products/${id}/stock`, { stockQuantity })
            .then(() => loadProducts())
            .catch(error => console.error('Chyba při ukládání skladu:', error));
    };

    return (
        <div>
            <AddProductForm onProductAdded={loadProducts} />
            <div className="card shadow-sm">
                <div className="card-body">
                    <h3 className="card-title h5 mb-3">Sklad produktů</h3>
                    {loading && <div>Načítám...</div>}
                    {!loading && products.length === 0 && (
                        <div className="text-muted">Zatím zde nejsou žádné produkty.</div>
                    )}
                    {!loading && products.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-sm align-middle">
                                <thead>
                                <tr>
                                    <th>Název</th>
                                    <th className="text-end">Cena</th>
                                    <th className="text-end">Skladem</th>
                                    <th className="text-end">Akce</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td className="text-end">
                                            {Number(product.price).toLocaleString('cs-CZ')} Kč
                                        </td>
                                        <td className="text-end" style={{ maxWidth: '120px' }}>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                min="0"
                                                value={stockEdits[product.id] ?? product.stockQuantity ?? 0}
                                                onChange={e => handleStockChange(product.id, e.target.value)}
                                            />
                                        </td>
                                        <td className="text-end">
                                            <div className="btn-group btn-group-sm">
                                                <button
                                                    className="btn btn-outline-success"
                                                    type="button"
                                                    onClick={() => handleStockSave(product.id)}
                                                >
                                                    Uložit sklad
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger"
                                                    type="button"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    Smazat
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;

