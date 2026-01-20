import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children, showNavbar = true }) => {
    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {showNavbar && <Navbar />}
            <main style={{ flex: 1, position: "relative" }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
