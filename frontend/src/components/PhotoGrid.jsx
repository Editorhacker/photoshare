export default function PhotoGrid({ photos }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "10px",
      padding: "20px"
    }}>
      {photos.map((p) => (
        <img
          key={p.fileId}
          src={`http://localhost:5000${p.viewUrl}`}
          alt={p.name}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px"
          }}
        />
      ))}
    </div>
  );
}
