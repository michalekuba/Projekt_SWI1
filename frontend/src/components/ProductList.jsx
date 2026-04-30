import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
    // Stav pro uložení produktů
    const [products, setProducts] = useState([]);
    // Stav pro ošetření načítání (nepovinné, ale profi)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Volání tvého Java API
        axios.get('http://localhost:8080/api/products')
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Chyba při komunikaci s backendem:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center">Načítám produkty...</div>;

    return (
        <div className="row">
            {products.map(product => (
                <div key={product.id} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm">
                        {/* Použijeme imageUrl z naší Java entity */}
                        <img
                            src={product.imageUrl || "https://placehold.co/400x400?text=Bez+obrazku"}
                            className="card-img-top"
                            alt={product.name}
                        />
                        <div className="card-body">
                            <h5 className="card-title fw-bold">{product.name}</h5>
                            <p className="card-text text-muted small">
                                {product.description}
                            </p>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <span className="h5 mb-0 text-success">{product.price} Kč</span>
                                <button className="btn btn-outline-primary btn-sm">Detail</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;