import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = ({ user, onCartChanged }) => {
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

    const handleAddToCart = (productId) => {
        if (!user) return;
        axios.post(`http://localhost:8080/api/cart/${user.id}/items`, {
            productId,
            quantity: 1
        })
            .then(() => onCartChanged?.())
            .catch(error => alert(error.response?.data || 'Přidání do košíku selhalo.'));
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

    if (loading) return <div className="text-center">Načítám produkty...</div>;

    return (
        <div className="row">
            {products.map(product => (
                <div key={product.id} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm">
                        <img
                            src={product.imageUrl || "https://placehold.co/400x400?text=Bez+obrazku"}
                            className="card-img-top"
                            alt={product.name}
                        />
                        <div className="card-body">
                            <h5 className="card-title fw-bold">{product.name}</h5>
                            <p className="card-text text-muted small">{product.description}</p>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <span className="h5 mb-0 text-success">
                                    {Number(product.price).toLocaleString('cs-CZ')} Kč
                                </span>
                                <button className="btn btn-outline-primary btn-sm">Detail</button>
                            </div>
                            <div className="text-muted small mt-2">
                                Skladem: {product.stockQuantity ?? 0} ks
                            </div>
                            {user && (
                                <button
                                    className="btn btn-primary btn-sm w-100 mt-2"
                                    onClick={() => handleAddToCart(product.id)}
                                    disabled={(product.stockQuantity ?? 0) <= 0}
                                >
                                    Přidat do košíku
                                </button>
                            )}
                            {user?.role === 'ADMIN' && (
                                <div className="mt-2">
                                    <div className="input-group input-group-sm">
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            value={stockEdits[product.id] ?? product.stockQuantity ?? 0}
                                            onChange={e => handleStockChange(product.id, e.target.value)}
                                        />
                                        <button
                                            className="btn btn-outline-success"
                                            type="button"
                                            onClick={() => handleStockSave(product.id)}
                                        >
                                            Uložit sklad
                                        </button>
                                    </div>
                                </div>
                            )}
                            {user?.role === 'ADMIN' && (
                                <button
                                    className="btn btn-danger btn-sm w-100 mt-2"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    🗑 Smazat produkt
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;