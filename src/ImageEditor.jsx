import React, { useState, useRef } from "react";
import { Cropper, CropperPreview } from "react-advanced-cropper";
import imageCompression from "browser-image-compression";
import "react-advanced-cropper/dist/style.css";
import ZoomInIcon from "./assets/zoom_in.svg";
import ZoomOutIcon from "./assets/zoom_out.svg";
import VerticalFlipIcon from "./assets/vertical-flip.svg";
import HorizontalFlipIcon from "./assets/horizontal-flip.svg";
import RotateRightIcon from "./assets/rotate_right.svg";
import RotateLeftIcon from "./assets/rotate_left.svg";
import ArrowUpIcon from "./assets/arrow_upward.svg";
import ArrowDownIcon from "./assets/arrow_downward.svg";
import ArrowRightIcon from "./assets/arrow_right.svg";
import ArrowLeftIcon from "./assets/arrow_left.svg";

export default function ImageEditor() {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const cropperRef = useRef(null);
  const previewRef = useRef(null);
  // Upload and compress before cropping
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const url = URL.createObjectURL(compressedFile);
      setImageSrc(url);
    } catch (err) {
      console.error("Compression error:", err);
    }
  };

  // Crop image and save compressed result
  const handleCrop = async () => {
    if (!cropperRef.current) return;
    const canvas = cropperRef.current.getCanvas();
    if (!canvas) return;
    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const croppedUrl = URL.createObjectURL(blob);
        setCroppedImage(croppedUrl);
      },
      "image/jpeg",
      0.9
    );
  };
  const handleDownload = () => {
    if (!croppedImage) return;
    const link = document.createElement("a");
    link.href = croppedImage;
    link.download = "cropped-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const flip = (horizontal, vertical) => {
    if (cropperRef.current) {
      cropperRef.current.flipImage(horizontal, vertical);
    }
  };
  const rotate = (angle) => {
    if (cropperRef.current) {
      cropperRef.current.rotateImage(angle);
    }
  };

  const zoomIn = () => {
    if (cropperRef.current) {
      cropperRef.current.zoomImage(1.6);
    }
  };

  const zoomOut = () => {
    if (cropperRef.current) {
      cropperRef.current.zoomImage(0.6);
    }
  };
  const move = (x, y) => {
    if (cropperRef.current) {
      console.log(cropperRef.current);
      console.log(x, y);
      cropperRef.current.moveImage(x, y);
    }
  };
  const onUpdate = (cropper) => {
    previewRef.current?.update(cropper);
  };

  return (
    <div>
      <h1 className="text-center text-4xl font-bold py-4">
        Add Image Resize, Preview & Crop Features{" "}
      </h1>
      <div className="flex items-center justify-center">
        <div>
          <div className="mx-auto">
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFileChange}
              className="bg-gray-300 px-2 py-2 mb-4"
            />
          </div>
          <div className="flex gap-4">
            {imageSrc && (
              <div>
                <h3 className="font-bold text-xl">Image for cropping</h3>
                <div style={{ width: 400, height: 300 }}>
                  <Cropper
                    ref={cropperRef}
                    src={imageSrc}
                    onUpdate={onUpdate}
                  />
                </div>
                <div>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={zoomIn}
                      className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      <img src={ZoomInIcon} alt="ZoomInIcon" />
                    </button>
                    <button
                      onClick={zoomOut}
                      className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      <img src={ZoomOutIcon} alt="ZoomOutIcon" />
                    </button>
                    <button
                      onClick={() => flip(false, true)}
                      className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      <img src={VerticalFlipIcon} alt="ZoomOutIcon" />
                    </button>
                    <button
                      onClick={() => flip(true, false)}
                      className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      <img src={HorizontalFlipIcon} alt="ZoomOutIcon" />
                    </button>
                    <button
                      onClick={() => rotate(90)}
                      className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      <img src={RotateRightIcon} alt="ZoomOutIcon" />
                    </button>
                    <button
                      onClick={() => rotate(-90)}
                      className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      <img src={RotateLeftIcon} alt="ZoomOutIcon" />
                    </button>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => move(0, -50)}
                      className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      <img src={ArrowUpIcon} alt="ZoomInIcon" />
                    </button>
                    <button
                      onClick={() => move(0, 50)}
                      className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      <img src={ArrowDownIcon} alt="ZoomInIcon" />
                    </button>
                    <button
                      onClick={() => move(-50, 0)}
                      className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      <img src={ArrowLeftIcon} alt="ZoomInIcon" />
                    </button>
                    <button
                      onClick={() => move(50, 0)}
                      className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      <img src={ArrowRightIcon} alt="ZoomInIcon" />
                    </button>
                  </div>
                  <button
                    onClick={handleCrop}
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    Save Cropped Image
                  </button>
                </div>
              </div>
            )}
            {imageSrc && (
              <div>
                <h3 className="font-bold text-xl">Preview Image:</h3>
                <div className="bg-black">
                  <CropperPreview
                    ref={previewRef}
                    className="m-auto"
                    style={{ width: 400, height: 300 }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
