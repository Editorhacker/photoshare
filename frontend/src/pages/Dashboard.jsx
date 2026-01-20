import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { currentUser } = useAuth(); // Auth is already guaranteed by the valid route + wrapper
  const [driveConnected, setDriveConnected] = useState(false);
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth(); // Still need auth instance for token

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const init = async () => {
      // Check URL params for drive auth callback
      const params = new URLSearchParams(window.location.search);
      if (params.get("drive") === "connected") {
        setDriveConnected(true);
        await fetchFolders(currentUser);
      } else {
        await checkDriveStatus(currentUser);
      }
    };

    init();
  }, [currentUser]);

  const checkDriveStatus = async (user) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/drive/list-folders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setDriveConnected(true);
        const data = await res.json();
        setFolders(data.folders || []);
      }
    } catch (e) {
      console.log("Drive not connected");
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async (user) => {
    try {
      setLoading(true);
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/drive/list-folders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFolders(data.folders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const connectDrive = async () => {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/drive/connect`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert(err.message);
    }
  };

  const createFolder = async () => {
    if (!folderName.trim()) return;
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/drive/create-folder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ folderName }),
      });

      if (!res.ok) throw new Error("Failed to create");

      await fetchFolders(currentUser);
      setShowPopup(false);
      setFolderName("");
      alert("Folder Created!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout>
      <div className="container animate-fade-in" style={{ padding: "40px" }}>
        <div className="flex-between" style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>Dashboard</h1>

          {driveConnected && (
            <Button onClick={() => setShowPopup(true)}>
              + New Folder
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex-center" style={{ minHeight: "200px" }}>
            <p className="animate-pulse">Loading Workspace...</p>
          </div>
        ) : !driveConnected ? (
          <div className="glass-card" style={{ padding: "60px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ fontSize: "3rem", marginBottom: "20px" }}>📂</div>
            <h2 style={{ marginBottom: "15px" }}>Connect Google Drive</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>
              Link your Google Drive account to start creating and sharing photo galleries.
              We only access folders created by this app.
            </p>
            <Button onClick={connectDrive} style={{ padding: "12px 30px" }}>
              Link Google Drive
            </Button>
          </div>
        ) : (
          <>
            {folders.length === 0 ? (
              <div className="glass-card" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                <p>No folders found. Create one to get started!</p>
              </div>
            ) : (
              <div className="grid-gallery">
                {folders.map(folder => (
                  <div
                    key={folder.id}
                    className="card"
                    onClick={() => navigate(`/folder/${folder.id}`)}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "15px" }}
                  >
                    <div style={{
                      width: "50px", height: "50px",
                      borderRadius: "12px",
                      background: "rgba(139, 92, 246, 0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.5rem"
                    }}>
                      📁
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>{folder.name}</h3>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Open Gallery →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Create Folder Modal */}
        {showPopup && (
          <div style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
          }}>
            <div className="glass-card animate-fade-in" style={{ width: "90%", maxWidth: "400px", padding: "30px" }}>
              <h3 style={{ marginBottom: "20px" }}>Create New Folder</h3>
              <Input
                placeholder="Folder Name (e.g., Wedding 2024)"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
                <Button variant="secondary" onClick={() => setShowPopup(false)}>Cancel</Button>
                <Button onClick={createFolder}>Create</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
