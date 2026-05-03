import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = ({ user, onCartChanged }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleAddToCart = (productId) => {
        if (!user) return;
        axios.post(`http://localhost:8080/api/cart/${user.id}/items`, {
            productId,
            quantity: 1
        })
            .then(() => onCartChanged?.())
            .catch(error => alert(error.response?.data || 'Přidání do košíku selhalo.'));
    };

    if (loading) return <div className="text-center">Načítám produkty...</div>;

    return (
        <div className="row">
            {products.map(product => (
                <div key={product.id} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm product-card">
                        <img
                            src={product.imageUrl || "https://placehold.co/400x400?text=Bez+obrazku"}
                            className="card-img-top product-card-img"
                            alt={product.name}
                        />
                        <div className="card-body product-card-body">
                            <div className="product-card-info">
                                <h5 className="card-title fw-bold">{product.name}</h5>
                                <p className="card-text text-muted small">{product.description}</p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <span className="h5 mb-0 text-success">
                                    {Number(product.price).toLocaleString('cs-CZ')} Kč
                                </span>
                            </div>
                            <div className="text-muted small mt-2">
                                Skladem: {product.stockQuantity ?? 0} ks
                            </div>
                            {user?.role === 'USER' && (
                                <button
                                    className="btn btn-primary btn-sm w-100 mt-2"
                                    onClick={() => handleAddToCart(product.id)}
                                    disabled={(product.stockQuantity ?? 0) <= 0}
                                >
                                    Přidat do košíku
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