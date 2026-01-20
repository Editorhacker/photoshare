import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

const FolderGallery = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Guaranteed loaded
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [expiryDays, setExpiryDays] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    fetchImages();
  }, [currentUser]);

  const fetchImages = async () => {
    if (!currentUser) return; // Guard clause

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(
        `${API_BASE_URL}/api/drive/list-images?folderId=${folderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    if (!currentUser) {
      alert("Please log in to upload images");
      return;
    }

    setUploading(true);

    try {
      const token = await currentUser.getIdToken();
      for (let file of files) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("folderId", folderId);

        await fetch(`${API_BASE_URL}/api/drive/upload-image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }
      setTimeout(() => {
        fetchImages();
        setUploading(false);
      }, 1500);

    } catch (err) {
      console.error(err);
      setUploading(false);
      alert("Upload failed");
    }
  };

  const handleShare = async () => {
    if (!currentUser) {
      alert("Please log in to share");
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/drive/share-folder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          folderId,
          days: expiryDays ? parseInt(expiryDays) : null
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Sharing failed");

      const link = `${window.location.origin}/gallery/${data.shareToken}`;
      setShareLink(link);
      setShowShareModal(false);

      // Copy to clipboard
      navigator.clipboard.writeText(link);
      alert("Link generated and copied to clipboard!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout>
      <div className="container animate-fade-in" style={{
        height: "calc(100vh - 160px)", // Fixed height to prevent full page scroll
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        marginTop: "20px"
      }}>

        {/* Header - Fixed at top of flex container */}
        <div style={{
          flexShrink: 0,
          padding: '10px 0 20px 0',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div className="flex-center" style={{ gap: "10px" }}>
            <Button variant="secondary" onClick={() => navigate("/dashboard")} style={{ padding: "8px 12px" }}>
              ←
            </Button>
            <h2 style={{ margin: 0 }}>Gallery</h2>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="secondary" onClick={() => setShowShareModal(true)}>
              Share Gallery
            </Button>

            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={uploadImages}
            />
            <Button onClick={() => fileInputRef.current.click()} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Photos"}
            </Button>
          </div>
        </div>

        {/* Scrollable Grid Area */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          paddingRight: "10px",
          paddingBottom: "20px"
        }}>

          {shareLink && (
            <div style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ color: "#6ee7b7", fontSize: "0.9rem" }}>Active Link: {shareLink}</span>
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  alert("Copied!");
                }}
                style={{ padding: "4px 10px", fontSize: "0.8rem" }}
              >
                Copy Again
              </Button>
            </div>
          )}

          {loading ? (
            <div className="flex-center" style={{ height: "200px" }}>
              <p className="animate-pulse">Loading images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="glass-card" style={{ padding: "60px", textAlign: "center" }}>
              <p>No images in this folder yet.</p>
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current.click()}
                style={{ marginTop: "20px" }}
              >
                Upload your first photo
              </Button>
            </div>
          ) : (
            <div className="grid-gallery">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="card"
                  style={{ padding: 0, overflow: "hidden", border: "none" }}
                >
                  <img
                    src={img.thumbnailLink}
                    alt={img.name}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "250px",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.3s ease"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                  />
                  <div style={{ padding: "12px" }}>
                    <p style={{ fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text-main)" }}>
                      {img.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
          }}>
            <div className="glass-card animate-fade-in" style={{ width: "90%", maxWidth: "400px", padding: "30px" }}>
              <h3 style={{ marginBottom: "10px" }}>Share Gallery</h3>
              <p style={{ marginBottom: "20px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                Generate a public link for clients to download selections.
              </p>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Link Expiration (Days)</label>
                <Input
                  type="number"
                  placeholder="e.g. 7 (Leave empty for no expiry)"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  min="1"
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
                <Button variant="secondary" onClick={() => setShowShareModal(false)}>Cancel</Button>
                <Button onClick={handleShare}>Generate Link</Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default FolderGallery;
