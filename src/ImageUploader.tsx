import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import ImageIcon from "../../../assets/imageUpload.svg";
import imageCompression from "browser-image-compression";
import Modal from "../Modal";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import PrimaryButton from "../Buttons/PrimaryButton";
import Spinner from "../Spinner";

interface IImageUploadField {
  values: any;
  setFieldValue: any;
  label: any;
}

const SingleImageUpload: React.FC<IImageUploadField> = ({
  setFieldValue,
  values,
  label,
}) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [openResizeModal, setOpenResizeModal] = useState<boolean>(false);
  const cropperRef = useRef<any>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const url = URL.createObjectURL(compressedFile);
      setImageUrl(url);
      setOpenResizeModal(true);
    } catch (err) {
      console.error("Compression error:", err);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      handleImageUpload(acceptedFiles[0]);
    },
  });

  const handleCrop = () => {
    if (!cropperRef.current) return;
    const canvas = cropperRef.current.getCanvas();
    if (!canvas) return;
    canvas.toBlob(
      (blob: Blob | null) => {
        if (!blob) return;
        const croppedUrl = URL.createObjectURL(blob);
        setFieldValue("image", croppedUrl);
        setImageUrl(croppedUrl);
        setOpenResizeModal(false);
      },
      "image/jpeg",
      0.9
    );
  };
  const flip = (horizontal: boolean, vertical: boolean) => {
    if (cropperRef.current) {
      cropperRef.current.flip(horizontal, vertical);
    }
  };

  const rotate = (angle: number) => {
    if (cropperRef.current) {
      cropperRef.current.rotate(angle);
    }
  };
  return (
    <div className="mb-3 w-full">
      <label>{label}</label>
      <div
        {...getRootProps()}
        className="border-dashed border-2 border-current p-4 flex flex-col items-center cursor-pointer"
      >
        {imageUrl ? (
          <img src={imageUrl} alt="" className="w-20 h-20" />
        ) : values?.image ? (
          <img src={values?.image} alt="" className="w-20 h-20" />
        ) : (
          <img src={ImageIcon} alt="" className="w-20 h-20" />
        )}

        <input {...getInputProps()} />
        <p className="text-center mt-2">
          Drag & drop or click to select an image
        </p>
      </div>
      <Modal
        open={openResizeModal}
        setOpen={setOpenResizeModal}
        title="Image Cropping"
      >
        {imageUrl ? (
          <div style={{ height: 300 }} className="pb-4">
            <Cropper
              key={imageUrl}
              ref={cropperRef}
              src={imageUrl}
              className="cropper"
            />
          </div>
        ) : (
          <Spinner />
        )}
        <div className="controls" style={{ marginBottom: 10 }}>
          <button onClick={() => rotate(90)}>Rotate 90°</button>
          <button onClick={() => rotate(-90)}>Rotate -90°</button>

          <button onClick={() => flip(true, false)}>Flip Horizontal</button>
          <button onClick={() => flip(false, true)}>Flip Vertical</button>
        </div>
        <PrimaryButton
          text={"Save Cropped Image"}
          type={"button"}
          onClick={handleCrop}
        />
      </Modal>
    </div>
  );
};

export default SingleImageUpload;
