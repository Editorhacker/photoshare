import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [driveConnected, setDriveConnected] = useState(false);
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const init = async () => {
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
      <div className="container animate-fade-in px-6 md:px-10 py-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h1 className="text-2xl font-semibold">Dashboard</h1>

          {driveConnected && (
            <Button onClick={() => setShowPopup(true)}>
              + New Folder
            </Button>
          )}
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <p className="animate-pulse text-[var(--text-muted)]">
              Loading Workspace...
            </p>
          </div>
        ) : !driveConnected ? (

          /* CONNECT DRIVE CARD */
          <div className="glass-card p-10 md:p-14 text-center max-w-[600px] mx-auto">
            <div className="text-5xl mb-5">📂</div>
            <h2 className="mb-3 text-xl font-semibold">Connect Google Drive</h2>
            <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
              Link your Google Drive account to start creating and sharing photo galleries.
              We only access folders created by this app.
            </p>
            <Button onClick={connectDrive} className="px-8 py-3">
              Link Google Drive
            </Button>
          </div>

        ) : (

          <>
            {/* NO FOLDERS */}
            {folders.length === 0 ? (
              <div className="glass-card p-10 text-center text-[var(--text-muted)]">
                <p>No folders found. Create one to get started!</p>
              </div>
            ) : (

              /* FOLDER GRID */
              <div className="
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
              ">
                {folders.map(folder => (
                  <div
                    key={folder.id}
                    onClick={() => navigate(`/folder/${folder.id}`)}
                    className="
                      card cursor-pointer flex items-center gap-4 p-5
                      hover:scale-[1.02] transition-transform
                    "
                  >
                    <div className="
                      w-12 h-12 rounded-xl 
                      bg-[rgba(139,92,246,0.1)]
                      flex items-center justify-center text-xl
                    ">
                      📁
                    </div>

                    <div>
                      <h3 className="text-base font-medium mb-1">
                        {folder.name}
                      </h3>
                      <span className="text-xs text-[var(--text-muted)]">
                        Open Gallery →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* CREATE FOLDER MODAL */}
        {showPopup && (
          <div className="
            fixed inset-0 bg-black/60 backdrop-blur-md
            flex items-center justify-center z-[100]
          ">
            <div className="
              glass-card animate-fade-in
              w-[90%] max-w-[420px] p-7
            ">
              <h3 className="mb-4 text-lg font-semibold">
                Create New Folder
              </h3>

              <Input
                placeholder="Folder Name (e.g., Wedding 2024)"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
              />

              <div className="flex gap-3 justify-end mt-5">
                <Button
                  variant="secondary"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </Button>

                <Button onClick={createFolder}>
                  Create
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default Dashboard;
