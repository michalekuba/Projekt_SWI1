import React, { useState } from 'react';
import axios from 'axios';

const AddProductForm = ({ onProductAdded }) => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        stockQuantity: 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/products', product)
            .then(response => {
                alert('Produkt úspěšně přidán!');
                setProduct({ name: '', description: '', price: '', imageUrl: '', stockQuantity: 0 });
                onProductAdded();
            })
            .catch(error => console.error('Chyba při přidávání produktu:', error));
    };

    return (
        <div className="card shadow-sm mb-5">
            <div className="card-body">
                <h3 className="card-title h5 mb-4">Přidat nový produkt</h3>
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <input
                                type="text" className="form-control" placeholder="Název" required
                                value={product.name} onChange={e => setProduct({...product, name: e.target.value})}
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="number" className="form-control" placeholder="Cena" required
                                value={product.price} onChange={e => setProduct({...product, price: e.target.value})}
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="number" className="form-control" placeholder="Skladem" min="0" required
                                value={product.stockQuantity}
                                onChange={e => setProduct({...product, stockQuantity: Number(e.target.value)})}
                            />
                        </div>
                        <div className="col-12">
                            <textarea
                                className="form-control" placeholder="Popis"
                                value={product.description} onChange={e => setProduct({...product, description: e.target.value})}
                            ></textarea>
                        </div>
                        <div className="col-12">
                            <input
                                type="text" className="form-control" placeholder="URL obrázku"
                                value={product.imageUrl} onChange={e => setProduct({...product, imageUrl: e.target.value})}
                            />
                        </div>
                        <div className="col-12 text-end">
                            <button type="submit" className="btn btn-primary w-100">Uložit produkt</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;