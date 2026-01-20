import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { API_BASE_URL } from "../config/api";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
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
        body: JSON.stringify({ 
          uid: user.uid, 
          email: user.email,
          name: name 
        }),
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
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)] px-5">
      <div
        className="
          glass-card animate-fade-in 
          w-full max-w-[420px] p-8 md:p-10
        "
      >
        <h2 className="text-center text-2xl md:text-[2rem] mb-7">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-5 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          
          {/* NAME FIELD (NEW) */}
          <div>
            <label className="block mb-2 text-[var(--text-muted)] text-sm">
              Full Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-2 text-[var(--text-muted)] text-sm">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-2 text-[var(--text-muted)] text-sm">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center mt-5 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--primary)]">
            Log in
          </Link>
        </p>

        <div className="text-center mt-3">
          <Link
            to="/"
            className="text-xs text-[var(--text-muted)] hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
