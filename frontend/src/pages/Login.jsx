import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: "100vh", background: "var(--bg-dark)" }}>
            <div className="glass-card animate-fade-in" style={{ width: "100%", maxWidth: "400px", padding: "40px" }}>
                <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2rem" }}>Welcome Back</h2>

                {error && <p style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>{error}</p>}

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <Button type="submit" disabled={loading} style={{ width: "100%", marginTop: "10px" }}>
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.9rem" }}>
                    Don't have an account? <Link to="/signup" style={{ color: "var(--primary)" }}>Sign up</Link>
                </p>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>← Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
