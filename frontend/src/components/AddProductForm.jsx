import { useEffect, useState } from 'react';
import axios from 'axios';

const emptyProduct = {
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    stockQuantity: 0
};

const AddProductForm = ({
    initialProduct,
    mode = 'create',
    onProductSaved,
    onCancel,
    onProductDeleted
}) => {
    const [product, setProduct] = useState(emptyProduct);
    const isEdit = mode === 'edit';

    useEffect(() => {
        if (initialProduct) {
            setProduct({
                id: initialProduct.id,
                name: initialProduct.name || '',
                description: initialProduct.description || '',
                price: initialProduct.price ?? '',
                imageUrl: initialProduct.imageUrl || '',
                stockQuantity: initialProduct.stockQuantity ?? 0
            });
            return;
        }
        setProduct(emptyProduct);
    }, [initialProduct, mode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            stockQuantity: Number(product.stockQuantity)
        };
        const request = isEdit
            ? axios.put(`http://localhost:8080/api/products/${product.id}`, payload)
            : axios.post('http://localhost:8080/api/products', payload);

        request
            .then(response => {
                alert(isEdit ? 'Produkt byl upraven.' : 'Produkt úspěšně přidán!');
                if (!isEdit) {
                    setProduct(emptyProduct);
                }
                onProductSaved?.(response.data);
            })
            .catch(error => console.error('Chyba při ukládání produktu:', error));
    };

    const handleDelete = () => {
        if (!product.id) return;
        if (!window.confirm('Opravdu chcete smazat tento produkt?')) return;
        axios.delete(`http://localhost:8080/api/products/${product.id}`)
            .then(() => {
                alert('Produkt byl smazán.');
                onProductDeleted?.(product.id);
            })
            .catch(error => console.error('Chyba při mazání produktu:', error));
    };

    return (
        <div className="card shadow-sm mb-5">
            <div className="card-body">
                <h3 className="card-title h5 mb-4">
                    {isEdit ? 'Upravit produkt' : 'Přidat nový produkt'}
                </h3>
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
                        <div className="col-12 d-flex flex-wrap justify-content-end gap-2">
                            {onCancel && (
                                <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                                    Zrušit
                                </button>
                            )}
                            {isEdit && (
                                <button type="button" className="btn btn-outline-danger" onClick={handleDelete}>
                                    Smazat produkt
                                </button>
                            )}
                            <button type="submit" className="btn btn-primary">
                                {isEdit ? 'Uložit změny' : 'Uložit produkt'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;