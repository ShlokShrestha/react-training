import React, { useRef, useState } from "react";
import Cropper from "cropperjs";

const TestCropper = () => {
  const imageRef = useRef(null);
  const cropperRef = useRef(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (imageRef.current) {
        imageRef.current.src = reader.result;

        // Initialize Cropper
        if (cropperRef.current) {
          cropperRef.current.destroy(); // destroy previous instance
        }
        cropperRef.current = new Cropper(imageRef.current);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCroppedCanvas();
      setCroppedImage(canvas.toDataURL("image/png"));
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <div style={{ marginTop: "20px" }}>
        <img
          ref={imageRef}
          alt="To be cropped"
          style={{ maxWidth: "100%", maxHeight: "400px" }}
        />
      </div>
      <button onClick={handleCrop} style={{ marginTop: "10px" }}>
        Crop
      </button>

      {croppedImage && (
        <div style={{ marginTop: "20px" }}>
          <h3>Cropped Image:</h3>
          <img src={croppedImage} alt="Cropped" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
};

export default TestCropper;
{
  /* <div style={{ margin: "20px auto" }}>
        <cropper-canvas
          ref={canvasRef}
          shadow-root-mode="open"
          slottable
          theme-color="#39f"
          scale-step="0.1"
        >
          <cropper-image ref={imageRef}></cropper-image>
        </cropper-canvas>
      </div> */
}
