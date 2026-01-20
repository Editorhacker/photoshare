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
  const { currentUser } = useAuth();
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
    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(
        `${API_BASE_URL}/api/drive/list-images?folderId=${folderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
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
      }, 1200);
    } catch (err) {
      console.error(err);
      setUploading(false);
      alert("Upload failed");
    }
  };

  const handleShare = async () => {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/api/drive/share-folder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          folderId,
          days: expiryDays ? parseInt(expiryDays) : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Sharing failed");

      const link = `${window.location.origin}/gallery/${data.shareToken}`;
      setShareLink(link);
      setShowShareModal(false);

      navigator.clipboard.writeText(link);
      alert("Link generated and copied to clipboard!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Layout>
      <div className="container animate-fade-in px-4 md:px-8 lg:px-10 py-5 h-[calc(100vh-140px)] flex flex-col">

        {/* HEADER */}
        <div className="flex-shrink-0 mt-4 pb-4 mb-4 border-b border-[rgba(255,255,255,0.05)] 
                        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard")}
              className="px-2 py-1"
            >
              ←
            </Button>
            <h2 className="text-lg mt-2 md:text-xl font-semibold">Gallery</h2>
          </div>

          <div className="flex justify-between gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowShareModal(true)}
            >
              Share Gallery
            </Button>

            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={uploadImages}
            />

            <Button
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Photos"}
            </Button>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto pr-1 pb-5">

          {/* ACTIVE SHARE LINK */}
          {shareLink && (
            <div className="mb-4 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)"
              }}
            >
              <span className="text-sm text-[#6ee7b7] break-all">
                Active Link: {shareLink}
              </span>

              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  alert("Copied!");
                }}
                className="px-3 py-1 text-xs"
              >
                Copy Again
              </Button>
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="flex items-center justify-center h-[200px]">
              <p className="animate-pulse text-[var(--text-muted)]">
                Loading images...
              </p>
            </div>
          ) : images.length === 0 ? (

            /* EMPTY STATE */
            <div className="glass-card p-8 md:p-12 text-center max-w-[600px] mx-auto">
              <p>No images in this folder yet.</p>
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current.click()}
                className="mt-5"
              >
                Upload your first photo
              </Button>
            </div>

          ) : (

            /* RESPONSIVE IMAGE GRID */
            <div
  className="
    grid 
    grid-cols-1              /* smaller tiles on mobile */
    sm:grid-cols-2 
    md:grid-cols-3 
    lg:grid-cols-3 
    xl:grid-cols-3 
    gap-3 md:gap-4           /* tighter gap on mobile, normal on desktop */
  "
>
  {images.map((img) => (
    <div
      key={img.id}
      className="card overflow-hidden border-none p-0"
    >
      <img
        src={img.thumbnailLink}
        alt={img.name}
        loading="lazy"
        className="
          w-full 
          h-[160px] sm:h-[200px] md:h-[240px] lg:h-[260px]
          object-cover 
          transition-transform duration-300
          hover:scale-105
        "
      />

      <div className="p-2 md:p-3">
        <p className="text-xs md:text-sm truncate text-[var(--text-main)]">
          {img.name}
        </p>
      </div>
    </div>
  ))}
</div>

          )}
        </div>

        {/* SHARE MODAL */}
        {showShareModal && (
          <div className="
            fixed inset-0 bg-black/60 backdrop-blur-md
            flex items-center justify-center z-[1000]
          ">
            <div className="
              glass-card animate-fade-in
              w-[90%] max-w-[420px] p-6 md:p-7
            ">
              <h3 className="mb-2 text-lg font-semibold">Share Gallery</h3>
              <p className="mb-4 text-sm text-[var(--text-muted)]">
                Generate a public link for clients to download selections.
              </p>

              <div className="mb-5">
                <label className="block mb-2 text-sm">
                  Link Expiration (Days)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 7 (Leave empty for no expiry)"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  min="1"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowShareModal(false)}
                >
                  Cancel
                </Button>

                <Button onClick={handleShare}>
                  Generate Link
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default FolderGallery;
