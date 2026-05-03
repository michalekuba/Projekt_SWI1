import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductList from './components/ProductList';
import AddProductForm from './components/AddProductForm';
import Login from './components/Login'; // Import nového Loginu
import Cart from './components/Cart';
import ChangePassword from './components/ChangePassword';

function App() {
    const [user, setUser] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [showLogin, setShowLogin] = useState(false);
    const [cartRefreshKey, setCartRefreshKey] = useState(0);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [activePage, setActivePage] = useState('products');

    useEffect(() => {
        let pageName = 'Produkty';
        if (showLogin && !user) {
            pageName = 'Přihlášení';
        } else if (activePage === 'cart') {
            pageName = 'Košík';
        } else if (activePage === 'change-password') {
            pageName = 'Změna hesla';
        }
        document.title = `IT-shop | ${pageName}`;
    }, [showLogin, activePage, user]);

    return (
        <div className="min-vh-100 bg-light pb-5">
            <nav className="navbar navbar-dark bg-dark mb-4 shadow">
                <div className="container">
                    <span className="navbar-brand mb-0 h1">IT-shop</span>
                    <div>
                        {user ? (
                            <div className="d-flex align-items-center gap-2">
                                <button
                                    className="btn btn-outline-light btn-sm"
                                    onClick={() => {
                                        setActivePage('cart');
                                    }}
                                >
                                    Košík
                                </button>
                                <button
                                    className="btn btn-outline-light btn-sm"
                                    onClick={() => {
                                        setActivePage('products');
                                    }}
                                >
                                    Produkty
                                </button>
                                <div className="position-relative">
                                    <button
                                        className="btn btn-outline-light btn-sm"
                                        type="button"
                                        onClick={() => setShowUserMenu((current) => !current)}
                                    >
                                        {user.username}
                                    </button>
                                    {showUserMenu && (
                                        <div className="dropdown-menu dropdown-menu-end show" style={{ position: 'absolute', right: 0 }}>
                                            <button
                                                className="dropdown-item"
                                                type="button"
                                                onClick={() => {
                                                    setActivePage('change-password');
                                                    setShowUserMenu(false);
                                                }}
                                            >
                                                Změna hesla
                                            </button>
                                            {user?.role === 'ADMIN' && (
                                                <button
                                                    className="dropdown-item"
                                                    type="button"
                                                    onClick={() => setRefreshKey(k => k + 1)}
                                                >
                                                    Obnovit produkty
                                                </button>
                                            )}
                                            <div className="dropdown-divider"></div>
                                            <button
                                                className="dropdown-item text-danger"
                                                type="button"
                                                onClick={() => {
                                                    setUser(null);
                                                    setActivePage('products');
                                                    setShowUserMenu(false);
                                                }}
                                            >
                                                Odhlásit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <button className="btn btn-primary btn-sm" onClick={() => setShowLogin(!showLogin)}>
                                {showLogin ? "Zpět na produkty" : "Přihlásit se"}
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <div className="container">
                {showLogin && !user ? (
                    <Login onLoginSuccess={(userData) => {setUser(userData); setShowLogin(false);}} />
                ) : (
                    <div>
                        {user && activePage === 'cart' && (
                            <Cart user={user} refreshKey={cartRefreshKey} onCartChanged={() => setCartRefreshKey(k => k + 1)} />
                        )}
                        {user && activePage === 'change-password' && (
                            <ChangePassword user={user} />
                        )}
                        {activePage === 'products' && (
                            <div>
                                {user?.role === 'ADMIN' && (
                                    <AddProductForm onProductAdded={() => setRefreshKey(k => k + 1)} />
                                )}
                                <h2 className="fw-light mb-4">Naše nabídka</h2>
                                <ProductList
                                    key={refreshKey}
                                    user={user}
                                    onCartChanged={() => setCartRefreshKey(k => k + 1)}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
            <footer className="text-center text-muted py-4 mt-5 border-top">
                <small>© 2026 IT-shop · Vytvořeno v rámci předmětu SWI1</small>
            </footer>
        </div>
    );
}

export default App;