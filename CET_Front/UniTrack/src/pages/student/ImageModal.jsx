import React from "react";

export default function ImageModal({ image, onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>X</button>
        <img src={image} alt="Full" style={styles.fullImage} />
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    position: "relative",
    background: "#fff",
    padding: 10,
    borderRadius: 10,
    maxWidth: "90%",
    maxHeight: "90%",
  },
  closeBtn: {
    position: "absolute",
    top: 10, right: 10,
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: 30, height: 30,
    cursor: "pointer",
  },
  fullImage: { maxWidth: "100%", maxHeight: "80vh", borderRadius: 8 },
};
