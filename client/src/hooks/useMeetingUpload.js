import { useState, useRef } from "react";
import { toast } from "react-toastify";
import useDragAndDrop from "./useDragAndDrop";
import useUploadMeetingApi from "./useUploadMeetingApi";

const allowedTypes = [
  "audio/wav",
  "audio/x-wav",
  "audio/mpeg",
  "audio/mp3",
  "audio/x-m4a",
  "audio/mp4",
  "audio/m4a",
];

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const useMeetingUpload = () => {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [meetingId, setMeetingId] = useState(null);

  const fileInputRef = useRef(null);

  const validateAndSetFile = (f) => {
    if (!f) return;
    const fileExt = f.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["wav", "mp3", "m4a", "mp4"];

    if (
      !allowedTypes.includes(f.type) &&
      !allowedExtensions.includes(fileExt)
    ) {
      toast.error("Unsupported file type. Please use WAV, MP3, or M4A files.");
      return;
    }
    setFile(f);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) validateAndSetFile(f);
  };

  const handleDropCallback = (e) => {
    const f = e.dataTransfer.files[0];
    if (f) validateAndSetFile(f);
  };

  const { isDragging, handlers } = useDragAndDrop(handleDropCallback);
  const { uploadProgress, isUploading, uploadMeeting } = useUploadMeetingApi();

  const resetUpload = (setSummary, setTitle) => {
    setFile(null);
    setTranscript("");
    if (setSummary) setSummary("");
    setMeetingId(null);
    if (setTitle) setTitle("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = (title, setTitle) => {
    if (!file) {
      toast.error("Please select an audio file first.");
      return;
    }
    setTranscript("");
    setMeetingId(null);
    uploadMeeting(file, title, (data) => {
      setTranscript(data.transcript || "");
      setMeetingId(data.meetingId || null);
      if (data.autoTitle && setTitle) setTitle(data.autoTitle);
    });
  };

  return {
    file,
    setFile,
    uploadProgress,
    isUploading,
    isDragging,
    transcript,
    setTranscript,
    meetingId,
    setMeetingId,
    fileInputRef,
    validateAndSetFile,
    handleFileChange,
    handleDragOver: handlers.onDragOver,
    handleDragLeave: handlers.onDragLeave,
    handleDrop: handlers.onDrop,
    resetUpload,
    handleUpload,
    formatFileSize,
  };
};

export default useMeetingUpload;
