import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface UploadDropzoneCardProps {
  onFileSelect: (file: File) => void;
  onError: (errorMsg: string) => void;
}

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export const UploadDropzoneCard: React.FC<UploadDropzoneCardProps> = ({
  onFileSelect,
  onError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const dragCounterRef = useRef(0);

  const validateAndSelect = (file: File) => {
    if (file.type !== "application/pdf") {
      onError("Only PDF files are supported. Please attach a .pdf file.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      onError("That file is larger than 20MB. Please attach a smaller PDF.");
      return;
    }
    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      validateAndSelect(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current += 1;
    setIsDragActive(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
    if (dragCounterRef.current === 0) {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDragActive(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      validateAndSelect(file);
    }
  };

  return (
    <div
      className="lawyers-empty"
      id="lawyers-preupload"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="visually-hidden"
        accept="application/pdf"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleInputChange}
      />

      <div className="upload-card">
        <div className="upload-card__icon" aria-hidden="true">
          <Upload size={24} />
        </div>
        <h2 className="upload-card__title">Drag &amp; drop your PDF here</h2>
        <span className="upload-card__or">or</span>
        <button
          type="button"
          className="btn btn--dark upload-card__btn"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose File
        </button>
        <p className="upload-card__hint">Supports PDF · Max 20MB</p>
      </div>

      <div
        className={`drop-overlay ${isDragActive ? "is-active" : ""}`}
        id="drop-overlay"
        aria-hidden="true"
      >
        <div className="drop-overlay__card">
          <Upload size={26} />
          <span>Drop your PDF here</span>
        </div>
      </div>
    </div>
  );
};
