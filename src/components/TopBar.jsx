import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";
import SignInModal from "./SignInModal";
import "./TopBar.css";

export default function TopBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <span className="topbar-logo" onClick={() => navigate("/")}>
            <img src="/logo.png" alt="" className="topbar-logo__img" />
            Read&amp;Go
          </span>
          {user && <span className="topbar-username">@{user.username}</span>}
        </div>
        <div className="topbar-center">
          <SearchBar />
        </div>
        <div className="topbar-right">
          {user ? (
            <>
              {["Admin", "Moderator"].includes(user.username) && (
                <button className="topbar-btn topbar-mod" onClick={() => navigate("/moderation")}>
                  Moderation
                </button>
              )}
              <button className="topbar-btn topbar-discover" onClick={() => navigate("/chat")}>
                Discover
              </button>
              <button className="topbar-btn topbar-create" onClick={() => navigate("/create")}>
                Create
              </button>
              <button className="topbar-btn topbar-logout" onClick={() => { signOut(); navigate("/"); }}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <button className="topbar-btn topbar-discover" onClick={() => navigate("/chat")}>
                Discover
              </button>
              <button className="topbar-btn topbar-signin" onClick={() => setShowModal(true)}>
                Sign In
              </button>
            </>
          )}
        </div>
      </header>
      {showModal && <SignInModal onClose={() => setShowModal(false)} />}
    </>
  );
}
