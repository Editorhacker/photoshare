import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import Button from "../components/ui/Button";

const ClientGallery = () => {
    const { shareToken } = useParams();
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewingImage, setViewingImage] = useState(null);

    // Storage Key
    const STORAGE_KEY = `gallery_selection_${shareToken}`;

    useEffect(() => {
        fetchImages();

        // Load saved selection from local storage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setSelectedImages(new Set(parsed));
                }
            } catch (e) {
                console.error("Failed to parse saved selection", e);
            }
        }

        // Disable right click globally on this page
        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener("contextmenu", handleContextMenu);
        return () => document.removeEventListener("contextmenu", handleContextMenu);
    }, [shareToken]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!viewingImage) return;

        const currentIndex = images.findIndex(img => img.fileId === viewingImage.fileId);
        const hasPrev = currentIndex > 0;
        const hasNext = currentIndex < images.length - 1;

        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft" && hasPrev) {
                setViewingImage(images[currentIndex - 1]);
            }
            if (e.key === "ArrowRight" && hasNext) {
                setViewingImage(images[currentIndex + 1]);
            }
            if (e.key === "Escape") {
                setViewingImage(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [viewingImage, images]);

    const fetchImages = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/public/${shareToken}/photos`);
            if (!res.ok) throw new Error("Invalid or expired gallery link");
            const data = await res.json();
            setImages(data.photos || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelection = (e, fileId) => {
        e.stopPropagation();
        const newSet = new Set(selectedImages);
        if (newSet.has(fileId)) {
            newSet.delete(fileId);
        } else {
            newSet.add(fileId);
        }
        setSelectedImages(newSet);

        // Save to local storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...newSet]));
    };

    const handleDownloadSelection = () => {
        if (selectedImages.size === 0) return;

        // Filter selected images
        const selectedList = images.filter(img => selectedImages.has(img.fileId));

        // Create text content (List of names)
        const content = selectedList.map(img => img.name).join("\n");

        // Create Blob
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        // Trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = "selected_photos.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) return (
        <div className="flex-center" style={{ height: "100vh", color: "white" }}>
            <div className="animate-pulse">Loading Gallery...</div>
        </div>
    );

    if (error) return (
        <div className="flex-center" style={{ height: "100vh", flexDirection: "column", color: "red" }}>
            <h3>Access Denied</h3>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{
            minHeight: "100vh",
            background: "#000",
            userSelect: "none",
            WebkitUserSelect: "none",
            paddingBottom: "100px" // Ensure space for scroll
        }}>

            {/* Header - Sticky */}
            <div
                className="
    sticky top-0 z-50
    bg-[rgba(0,0,0,0.8)] backdrop-blur-[10px]
    border-b border-white/10
    px-4 md:px-10 py-4
    flex flex-col sm:flex-row
    sm:items-center sm:justify-between
    gap-3 items-center
  "
            >
                <h1 className="text-xl md:text-2xl text-white m-0">
                    <span style={{ color: "var(--primary)" }}>✦</span> PhotoShare Gallery
                </h1>

                {selectedImages.size > 0 && (
                    <Button
                        onClick={handleDownloadSelection}
                        className="
        text-[8px] md:text-xs
        px-4 py-4
        w-fit sm:w-auto
      "
                    >
                        Download Selection ({selectedImages.size})
                    </Button>
                )}
            </div>


            {/* Grid */}
            <div className="container" style={{ padding: "40px 40px" }}>
                {images.length === 0 ? (
                    <p style={{ textAlign: "center", color: "gray" }}>No images found.</p>
                ) : (
                    <div className="grid-gallery">
                        {images.map((img) => {
                            const isSelected = selectedImages.has(img.fileId);
                            return (
                                <div
                                    key={img.fileId}
                                    style={{
                                        position: "relative",
                                        overflow: "hidden",
                                        borderRadius: "8px",
                                        aspectRatio: "1/1",
                                        cursor: "pointer",
                                        background: "#111",
                                        border: isSelected ? "2px solid var(--primary)" : "2px solid transparent",
                                        transition: "border-color 0.2s"
                                    }}
                                    onClick={() => setViewingImage(img)}
                                >

                                    {/* Selection Checkbox Overlay */}
                                    <div
                                        onClick={(e) => toggleSelection(e, img.fileId)}
                                        style={{
                                            position: "absolute",
                                            top: "10px", right: "10px",
                                            zIndex: 10,
                                            width: "24px", height: "24px",
                                            borderRadius: "6px",
                                            background: isSelected ? "var(--primary)" : "rgba(0,0,0,0.5)",
                                            border: "1px solid rgba(255,255,255,0.5)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            color: "white",
                                            fontSize: "14px",
                                            transition: "0.2s"
                                        }}
                                    >
                                        {isSelected && "✓"}
                                    </div>

                                    {/* Anti-drag Overlay */}
                                    <div style={{ position: "absolute", inset: 0, zIndex: 2 }}></div>

                                    <img
                                        src={`${API_BASE_URL}${img.viewUrl}`}
                                        alt="Gallery Item"
                                        loading="lazy"
                                        style={{
                                            width: "100%", height: "100%",
                                            objectFit: "cover",
                                            pointerEvents: "none",
                                            opacity: isSelected ? 0.7 : 1,
                                            transition: "opacity 0.2s"
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {viewingImage && (() => {
                const currentIndex = images.findIndex(img => img.fileId === viewingImage.fileId);
                const hasPrev = currentIndex > 0;
                const hasNext = currentIndex < images.length - 1;

                const handlePrev = (e) => {
                    e.stopPropagation();
                    if (hasPrev) setViewingImage(images[currentIndex - 1]);
                };

                const handleNext = (e) => {
                    e.stopPropagation();
                    if (hasNext) setViewingImage(images[currentIndex + 1]);
                };

                return (
                    <div style={{
                        position: "fixed", inset: 0,
                        background: "rgba(0,0,0,0.95)",
                        zIndex: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh"
                    }}
                        onClick={() => setViewingImage(null)}
                    >
                        {/* Close Btn */}
                        <button style={{
                            position: "absolute", top: "20px", right: "20px",
                            background: "transparent", border: "none", color: "white", fontSize: "2rem", cursor: "pointer", zIndex: 102
                        }}>
                            &times;
                        </button>

                        {/* Previous Button */}
                        {hasPrev && (
                            <button
                                onClick={handlePrev}
                                style={{
                                    position: "absolute", left: "20px",
                                    background: "rgba(255,255,255,0.1)",
                                    backdropFilter: "blur(10px)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    color: "white",
                                    fontSize: "2rem",
                                    width: "50px", height: "50px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    zIndex: 102,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.3s"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                                onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                            >
                                ←
                            </button>
                        )}

                        {/* Next Button */}
                        {hasNext && (
                            <button
                                onClick={handleNext}
                                style={{
                                    position: "absolute", right: "20px",
                                    background: "rgba(255,255,255,0.1)",
                                    backdropFilter: "blur(10px)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    color: "white",
                                    fontSize: "2rem",
                                    width: "50px", height: "50px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    zIndex: 102,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.3s"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                                onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                            >
                                →
                            </button>
                        )}

                        {/* Select Button in Lightbox */}
                        <button
                            onClick={(e) => toggleSelection(e, viewingImage.fileId)}
                            style={{
                                position: "absolute", bottom: "30px",
                                padding: "10px 20px",
                                background: selectedImages.has(viewingImage.fileId) ? "var(--primary)" : "rgba(255,255,255,0.2)",
                                color: "white",
                                border: "none",
                                borderRadius: "20px",
                                fontSize: "1rem",
                                cursor: "pointer",
                                zIndex: 102
                            }}
                        >
                            {selectedImages.has(viewingImage.fileId) ? "Selected ✓" : "Select Photo"}
                        </button>

                        {/* Transparent Blocking Image Overlay */}
                        <div style={{ position: "absolute", inset: 0, zIndex: 101 }}></div>

                        <img
                            src={`${API_BASE_URL}${viewingImage.viewUrl}`}
                            style={{
                                maxWidth: "90%",
                                maxHeight: "80vh",
                                pointerEvents: "none",
                                userSelect: "none",
                                boxShadow: "0 0 50px rgba(0,0,0,0.5)"
                            }}
                        />

                        {/* Image Counter */}
                        <div style={{
                            position: "absolute", top: "30px", left: "50%",
                            transform: "translateX(-50%)",
                            color: "white",
                            fontSize: "0.9rem",
                            background: "rgba(0,0,0,0.5)",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            zIndex: 102
                        }}>
                            {currentIndex + 1} / {images.length}
                        </div>
                    </div>
                );
            })()}

        </div>
    );
};

export default ClientGallery;
