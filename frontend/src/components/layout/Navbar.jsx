import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import Button from "../ui/Button"; // Assuming Button is in ui folder
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const { currentUser } = useAuth(); // Use context

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 40px",
            borderBottom: '1px solid var(--border-glass)',
            background: 'rgba(15, 16, 20, 0.8)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div
                onClick={() => navigate("/")}
                style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--text-main)", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
                <span style={{ color: "var(--primary)" }}>✦</span> PhotoShare
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {/* Public Links */}
                {!currentUser && (
                    <>
                        <a href="/" style={{ color: "var(--text-main)", fontSize: "0.95rem" }}>Home</a>
                        <a href="/about" style={{ color: "var(--text-main)", fontSize: "0.95rem" }}>About</a>
                        <Button onClick={() => navigate("/login")} style={{ padding: "8px 20px" }}>
                            Login
                        </Button>
                    </>
                )}

                {/* User Links */}
                {currentUser && (
                    <>
                        <a href="/dashboard" style={{ color: "var(--text-main)", fontSize: "0.95rem" }}>Dashboard</a>
                        <span style={{ width: "1px", height: "20px", background: "var(--border-color)" }}></span>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{currentUser.email}</span>
                        <Button variant="secondary" onClick={handleLogout} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                            Logout
                        </Button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
