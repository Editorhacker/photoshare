import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { API_BASE_URL } from "../config/api";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);

            // Create user in backend
            await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: user.uid, email: user.email }),
            });

            alert("Account created! Please check your email for verification.");
            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: "100vh", background: "var(--bg-dark)" }}>
            <div className="glass-card animate-fade-in" style={{ width: "100%", maxWidth: "400px", padding: "40px" }}>
                <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2rem" }}>Create Account</h2>

                {error && <p style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>{error}</p>}

                <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                            placeholder="Create a password"
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>Confirm Password</label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>

                    <Button type="submit" disabled={loading} style={{ width: "100%", marginTop: "10px" }}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Button>
                </form>

                <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.9rem" }}>
                    Already have an account? <Link to="/login" style={{ color: "var(--primary)" }}>Log in</Link>
                </p>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>← Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
