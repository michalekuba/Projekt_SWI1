import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminProducts = ({ onAddProduct, onEditProduct, refreshKey }) => {
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
    }, [refreshKey]);

    return (
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
                                    <td className="text-end">{product.stockQuantity ?? 0} ks</td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-outline-dark btn-sm"
                                            type="button"
                                            onClick={() => onEditProduct?.(product)}
                                        >
                                            Upravit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-primary" type="button" onClick={onAddProduct}>
                        Přidat nový produkt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
