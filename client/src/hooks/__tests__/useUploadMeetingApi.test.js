import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useUploadMeetingApi from "../useUploadMeetingApi";
import { meetingApi } from "../../services";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("../../services", () => ({
  meetingApi: {
    uploadMeeting: vi.fn(),
  },
}));

describe("useUploadMeetingApi hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default states", () => {
    const { result } = renderHook(() => useUploadMeetingApi());

    expect(result.current.uploadProgress).toBe(0);
    expect(result.current.isUploading).toBe(false);
  });

  it("should show error if no file is provided", async () => {
    const { result } = renderHook(() => useUploadMeetingApi());

    await act(async () => {
      await result.current.uploadMeeting(null, "Test Title", vi.fn());
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Please select an audio file first.",
    );
  });

  it("should successfully upload a file and call onSuccess", async () => {
    const mockResponse = { data: { success: true, transcript: "Hello" } };
    meetingApi.uploadMeeting.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUploadMeetingApi());
    const file = new File(["dummy content"], "test.mp3", { type: "audio/mp3" });
    const onSuccess = vi.fn();

    await act(async () => {
      await result.current.uploadMeeting(file, "Title", onSuccess);
    });

    expect(meetingApi.uploadMeeting).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Transcription complete!");
    expect(onSuccess).toHaveBeenCalledWith(mockResponse.data);
    expect(result.current.isUploading).toBe(false);
  });

  it("should handle upload failure", async () => {
    const mockResponse = { data: { success: false, message: "Upload failed" } };
    meetingApi.uploadMeeting.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUploadMeetingApi());
    const file = new File(["dummy content"], "test.mp3", { type: "audio/mp3" });

    await act(async () => {
      await result.current.uploadMeeting(file, "Title", vi.fn());
    });

    expect(toast.error).toHaveBeenCalledWith("Upload failed");
    expect(result.current.isUploading).toBe(false);
  });
});
