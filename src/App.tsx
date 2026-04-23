import { HashRouter as Router, Routes, Route } from "react-router-dom";

// Our two context providers (global state)
import { ThemeProvider } from "./context/ThemeContext";
import { InvoiceProvider } from "./context/InvoiceContext";

import Home from "./pages/Home";
import InvoiceDetailPage from "./pages/InvoiceDetailPage";

import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <Router>
          <div
            className="
            min-h-screen
            bg-[#F8F8FB] dark:bg-[#141625]
            transition-colors duration-300
            lg:flex lg:flex-row
          "
          >
            <Sidebar />

            <main className="flex-1 pt-[72px] lg:pt-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/invoice/:id" element={<InvoiceDetailPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </InvoiceProvider>
    </ThemeProvider>
  );
}