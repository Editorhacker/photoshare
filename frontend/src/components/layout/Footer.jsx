import React from "react";

const Footer = () => {
    return (
        <footer style={{
            borderTop: '1px solid var(--border-color)',
            padding: '40px 20px',
            marginTop: 'auto',
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
        }}>
            <div className="container flex-between" style={{ flexDirection: 'column', gap: '20px' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: "var(--primary)", fontSize: "1.2rem" }}>✦</span>
                    <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>PhotoShare</span>
                </div>

                <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <a href="/" style={{ color: 'inherit' }}>Home</a>
                    <a href="/about" style={{ color: 'inherit' }}>About</a>
                    <a href="/login" style={{ color: 'inherit' }}>Login</a>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
                    © {new Date().getFullYear()} PhotoShare. All rights reserved.
                </p>

            </div>
        </footer>
    );
};

export default Footer;
