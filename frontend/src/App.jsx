import 'bootstrap/dist/css/bootstrap.min.css';
import ProductList from './components/ProductList';

function App() {
    return (
        <div className="min-vh-100 bg-light">
            {/* Jednoduchá navigace */}
            <nav className="navbar navbar-dark bg-dark mb-4">
                <div className="container">
                    <span className="navbar-brand mb-0 h1">Můj E-shop</span>
                </div>
            </nav>

            <div className="container">
                <header className="mb-5">
                    <h1 className="fw-light">Nabídka produktů</h1>
                </header>

                <main>
                    <ProductList />
                </main>
            </div>
        </div>
    );
}

export default App;