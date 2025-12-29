import React, { useRef, useEffect, useState } from "react";
import CropperCanvas from "@cropper/element-canvas";
import CropperImage from "@cropper/element-image";
import CropperSelection from "@cropper/element-selection";
import CropperHandle from "@cropper/element-handle";
import CropperShade from "@cropper/element-shade";
import CropperCrossHair from "@cropper/element-crosshair";

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

CropperCanvas.$define();
CropperImage.$define();
CropperSelection.$define();
CropperHandle.$define();
CropperShade.$define();
CropperCrossHair.$define();

function CanvasCropper() {
  const [croppedImage, setCroppedImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const selectionRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
  };

  const handleCrop = async () => {
    if (selectionRef.current) {
      const canvas = await selectionRef.current.$toCanvas();
      const dataUrl = canvas.toDataURL("image/png");
      setCroppedImage(dataUrl);
    }
  };

  const flip = async (horizontal, vertical) => {
    if (imageRef.current) {
      await imageRef.current.$scale(horizontal, vertical);
    }
  };
  const rotate = async (angle) => {
    if (imageRef.current) {
      await imageRef.current.$rotate(angle);
    }
  };

  const zoomIn = async () => {
    if (imageRef.current) {
      await imageRef.current.$zoom(0.1);
    }
  };

  const zoomOut = async () => {
    if (imageRef.current) {
      await imageRef.current.$zoom(-0.1);
    }
  };
  const move = async (x, y) => {
    if (imageRef.current) {
      await imageRef.current.$move(x, y);
    }
  };
  const inSelection = (selection, max) => {
    return (
      selection.x >= max.x &&
      selection.y >= max.y &&
      selection.x + selection.width <= max.x + max.width &&
      selection.y + selection.height <= max.y + max.height
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const selection = selectionRef.current;

    if (!canvas || !image || !selection) return;

    const onSelectionChange = (event) => {
      const canvasRect = canvas.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();

      const maxSelection = {
        x: imageRect.left - canvasRect.left,
        y: imageRect.top - canvasRect.top,
        width: imageRect.width,
        height: imageRect.height,
      };

      if (!inSelection(event.detail, maxSelection)) {
        event.preventDefault();
      }
    };


    const onImageTransform = (event) => {
      const canvasRect = canvas.getBoundingClientRect();

      const clone = image.cloneNode();
      clone.style.transform = `matrix(${event.detail.matrix.join(",")})`;
      clone.style.opacity = "0";

      canvas.appendChild(clone);
      const imageRect = clone.getBoundingClientRect();
      canvas.removeChild(clone);

      const maxSelection = {
        x: imageRect.left - canvasRect.left,
        y: imageRect.top - canvasRect.top,
        width: imageRect.width,
        height: imageRect.height,
      };

      if (!inSelection(selection, maxSelection)) {
        event.preventDefault();
      }
    };

    selection.addEventListener("change", onSelectionChange);
    image.addEventListener("transform", onImageTransform);

    return () => {
      selection.removeEventListener("change", onSelectionChange);
      image.removeEventListener("transform", onImageTransform);
    };
  }, [imageSrc]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="bg-gray-300 px-2 py-2 mb-4"
      />
      {imageSrc && (
        <div>
          <div className="flex justify-center">
            <div className="relative space-y-2 ">
              <div className="flex flex-col gap-2 absolute top-0 -left-16">
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
                  onClick={() => move(0, 10)}
                  className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                >
                  <img src={ArrowUpIcon} alt="ZoomInIcon" />
                </button>
                <button
                  onClick={() => move(0, -10)}
                  className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                >
                  <img src={ArrowDownIcon} alt="ZoomInIcon" />
                </button>
                <button
                  onClick={() => move(10, 0)}
                  className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                >
                  <img src={ArrowLeftIcon} alt="ZoomInIcon" />
                </button>
                <button
                  onClick={() => move(-10, 0)}
                  className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                >
                  <img src={ArrowRightIcon} alt="ZoomInIcon" />
                </button>
              </div>
              <div>
                <cropper-canvas
                  style={{ width: "400px", height: "290px" }}
                  ref={canvasRef}
                >
                  <cropper-image
                    ref={imageRef}
                    src={imageSrc}
                    alt={"Picture"}
                    rotatable
                    scalable
                    skewable
                    translatable
                    initial-center-size="contain"
                    shadow-root-mode="open"
                  ></cropper-image>
                  <cropper-shade hidden></cropper-shade>
                  <cropper-selection
                    initial-coverage="0.5"
                    movable
                    resizable
                    ref={selectionRef}
                  >
                    <cropper-crosshair centered></cropper-crosshair>
                    <cropper-handle
                      action="move"
                      theme-color="rgba(255, 255, 255, 0.35)"
                      shadow-root-mode="open"
                    ></cropper-handle>
                    <cropper-handle action="n-resize"></cropper-handle>
                    <cropper-handle action="e-resize"></cropper-handle>
                    <cropper-handle action="s-resize"></cropper-handle>
                    <cropper-handle action="w-resize"></cropper-handle>
                    <cropper-handle action="ne-resize"></cropper-handle>
                    <cropper-handle action="nw-resize"></cropper-handle>
                    <cropper-handle action="se-resize"></cropper-handle>
                    <cropper-handle action="sw-resize"></cropper-handle>
                  </cropper-selection>
                </cropper-canvas>
              </div>
              <div className="flex gap-2 my-2">
                <button
                  onClick={() => flip(1, -1)}
                  className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                >
                  <img src={VerticalFlipIcon} alt="ZoomOutIcon" />
                </button>
                <button
                  onClick={() => flip(-1, 1)}
                  className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                >
                  <img src={HorizontalFlipIcon} alt="ZoomOutIcon" />
                </button>
                <button
                  onClick={() => rotate("45deg")}
                  className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                >
                  <img src={RotateRightIcon} alt="ZoomOutIcon" />
                </button>
                <button
                  onClick={() => rotate("-45deg")}
                  className="bg-gray-200 text-white px-4 py-2 rounded cursor-pointer"
                >
                  <img src={RotateLeftIcon} alt="ZoomOutIcon" />
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleCrop}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Save Cropped Image
          </button>
        </div>
      )}

      {croppedImage && <img src={croppedImage} alt="Cropped Result" />}
    </div>
  );
}

export default CanvasCropper;
