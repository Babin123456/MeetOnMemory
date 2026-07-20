import { useState } from "react";
import { toast } from "react-toastify";
import { meetingApi } from "../services";

const useUploadMeetingApi = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadMeeting = async (file, title, onSuccess) => {
    if (!file) {
      toast.error("Please select an audio file first.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);
      if (title) formData.append("title", title);

      const res = await meetingApi.uploadMeeting(formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);
        },
      });

      if (res.data?.success) {
        toast.success("Transcription complete!");
        if (onSuccess) onSuccess(res.data);
      } else {
        toast.error(res.data?.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Server error during upload",
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return { uploadProgress, isUploading, uploadMeeting };
};

export default useUploadMeetingApi;
