import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./SignInModal.css";

export default function SignInModal({ onClose }) {
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    const result = await signIn(username.trim(), password);
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Sign In / Register</h2>
        <p className="modal-hint">New username? We'll create your account.</p>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            className="modal-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <input
            className="modal-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="modal-error">{error}</p>}
          <button className="modal-submit" type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}
