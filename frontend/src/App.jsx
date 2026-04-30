import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductList from './components/ProductList';
import AddProductForm from './components/AddProductForm';

function App() {
    // Zde ukládáme přihlášeného uživatele. null = nikdo není přihlášen.
    const [user, setUser] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Pomocná funkce pro osvěžení seznamu produktů
    const handleProductAdded = () => {
        setRefreshKey(oldKey => oldKey + 1);
    };

    // Simulační funkce pro testování rolí (než uděláme login formulář)
    const simulateLogin = (role) => {
        setUser({
            username: role === 'ADMIN' ? 'Administrator' : 'Pepa',
            role: role
        });
    };

    return (
        <div className="min-vh-100 bg-light pb-5">
            {/* NAVIGACE */}
            <nav className="navbar navbar-dark bg-dark mb-4 shadow">
                <div className="container">
                    <span className="navbar-brand mb-0 h1">Můj E-shop</span>

                    <div className="d-flex align-items-center">
                        {user ? (
                            <div className="text-light">
                                <span className="me-3">Ahoj, <strong>{user.username}</strong> ({user.role})</span>
                                <button className="btn btn-outline-danger btn-sm" onClick={() => setUser(null)}>
                                    Odhlásit
                                </button>
                            </div>
                        ) : (
                            <div className="btn-group">
                                <button className="btn btn-outline-primary btn-sm" onClick={() => simulateLogin('USER')}>
                                    Login jako User
                                </button>
                                <button className="btn btn-outline-warning btn-sm" onClick={() => simulateLogin('ADMIN')}>
                                    Login jako Admin
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="row">
                    {/* HLAVNÍ ČÁST SE SEZNAMEM PRODUKTŮ */}
                    {/* Pokud je admin, zabere seznam jen 8 sloupců, aby zbylo místo na formulář */}
                    <div className={user?.role === 'ADMIN' ? "col-lg-8" : "col-12"}>
                        <h2 className="fw-light mb-4 text-secondary">Naše nabídka</h2>
                        <ProductList key={refreshKey} />
                    </div>

                    {/* FORMULÁŘ PRO PŘIDÁNÍ - Vidí pouze ADMIN */}
                    {user?.role === 'ADMIN' && (
                        <div className="col-lg-4">
                            <AddProductForm onProductAdded={handleProductAdded} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;