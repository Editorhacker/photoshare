import Layout from "../components/layout/Layout";

const About = () => {
    return (
        <Layout>
            <div className="container animate-fade-in" style={{ padding: "80px 20px", maxWidth: "800px" }}>

                <h1 style={{ fontSize: "3rem", marginBottom: "40px", textAlign: "center" }}>About PhotoShare</h1>

                <div className="glass-card" style={{ padding: "40px", marginBottom: "40px" }}>
                    <h2 style={{ color: "var(--primary)" }}>Our Mission</h2>
                    <p style={{ marginTop: "10px", fontSize: "1.1rem" }}>
                        PhotoShare was built to solve a simple problem: <strong>delivering photos to clients shouldn't be a hassle.</strong>
                        We bridge the gap between your storage (Google Drive) and your client's experience, providing a professional, branded gallery without the need for expensive transfers or complicated setups.
                    </p>
                </div>

                <div style={{ display: "grid", gap: "30px" }}>
                    <Section
                        title="For Photographers"
                        text="Focus on your craft, not file management. Simply connect your Drive, pick a folder, and generate a secure link. We handle the display, security, and expiry logic."
                    />
                    <Section
                        title="For Clients"
                        text="A clean, immersive viewing experience. Clients can easily view, select favorites, and download their selection lists—all in a distraction-free environment."
                    />
                </div>

            </div>
        </Layout>
    );
};

const Section = ({ title, text }) => (
    <div style={{ padding: "20px 0", borderTop: "1px solid var(--border-color)" }}>
        <h3 style={{ marginBottom: "10px", fontSize: "1.5rem" }}>{title}</h3>
        <p style={{ fontSize: "1rem", lineHeight: "1.8", color: "var(--text-muted)" }}>{text}</p>
    </div>
);

export default About;
