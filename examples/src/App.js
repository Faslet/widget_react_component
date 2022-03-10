import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {ProductPage} from "./ProductPage";
import {ThankYou} from "./ThankYou";

function App() {
    return (
        <div className="App">
            <header>
                Faslet Fashion Store
            </header>
            <main>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<ProductPage/>} />
                        <Route path="/thank-you" element={<ThankYou/>}/>
                    </Routes>
                </BrowserRouter>
            </main>
        </div>
    );
}

export default App;
