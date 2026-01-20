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
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)] px-5">
      <div
        className="
          glass-card animate-fade-in 
          w-full max-w-[400px] p-8 md:p-10
        "
      >
        <h2 className="text-center text-2xl md:text-[2rem] mb-7">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-5 text-sm">
            {error}
          </p>
        )}

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-5"
        >
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

          <div>
            <label className="block mb-2 text-[var(--text-muted)] text-sm">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center mt-5 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[var(--primary)]">
            Sign up
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

export default Login;
