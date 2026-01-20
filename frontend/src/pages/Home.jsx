import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";

const Home = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            {/* Hero Section */}
            <section style={{
                position: "relative",
                minHeight: "90vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                textAlign: "center",
                padding: "0 20px",
                overflow: "hidden"
            }}>
                {/* Background Blobs */}
                <div style={{
                    position: "absolute",
                    top: "20%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "60vw", height: "60vw",
                    background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)",
                    zIndex: -1,
                    pointerEvents: 'none'
                }}></div>

                <div style={{
                    position: "absolute",
                    bottom: "-20%", right: "-10%",
                    width: "40vw", height: "40vw",
                    background: "radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 60%)",
                    zIndex: -1,
                    pointerEvents: 'none'
                }}></div>

                <div className="container animate-fade-in" style={{ maxWidth: '900px' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-glass)',
                        fontSize: '0.85rem',
                        marginBottom: '30px',
                        color: 'var(--primary)'
                    }}>
                        ✦ The Photographer's Best Friend
                    </div>

                    <h1 style={{
                        fontSize: "clamp(3rem, 6vw, 5rem)",
                        marginBottom: "30px",
                        background: "linear-gradient(to right, #fff, #b8c1ec)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        lineHeight: 1.1
                    }}>
                        Deliver Photos <br /> Like a Pro.
                    </h1>

                    <p style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto 50px", color: "var(--text-muted)" }}>
                        Seamlessly connect Google Drive, create client galleries, and share your work with powerful tools designed for modern photographers.
                    </p>

                    <div style={{ display: "flex", gap: "20px", justifyContent: 'center' }}>
                        <Button onClick={() => navigate("/signup")} style={{ padding: "16px 48px", fontSize: "1.1rem" }}>
                            Get Started Free
                        </Button>
                        <Button variant="secondary" onClick={() => navigate("/about")} style={{ padding: "16px 48px", fontSize: "1.1rem" }}>
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="container" style={{ padding: "100px 40px" }}>
                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <h2 style={{ fontSize: "2.5rem" }}>Workflow Simplified</h2>
                    <p style={{ fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto" }}>Everything you need to manage and share your photography business.</p>
                </div>

                <div className="grid-gallery">
                    <FeatureCard
                        icon="🔒"
                        title="Secure Galleries"
                        desc="Create private, view-only links for your clients. Prevent unauthorized downloads."
                    />
                    <FeatureCard
                        icon="☁️"
                        title="Drive Integration"
                        desc="Connect directly to Google Drive. No need to double-upload your high-res files."
                    />
                    <FeatureCard
                        icon="⏱️"
                        title="Auto-Expiry"
                        desc="Set custom expiration dates for your links to manage client access automatically."
                    />
                    <FeatureCard
                        icon="✨"
                        title="Premium UI"
                        desc="A stunning, dark-themed experience that highlights your work without distractions."
                    />
                </div>
            </section>
        </Layout>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-card" style={{
        padding: "40px",
        textAlign: "left",
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        border: '1px solid rgba(255,255,255,0.05)'
    }}>
        <div style={{
            width: '60px', height: '60px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: "2rem", marginBottom: "10px"
        }}>{icon}</div>

        <h3 style={{ fontSize: "1.4rem" }}>{title}</h3>
        <p style={{ fontSize: "0.95rem" }}>{desc}</p>
    </div>
);

export default Home;
