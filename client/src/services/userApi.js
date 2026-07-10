import apiClient from "./apiClient";

export const userApi = {
  updateProfile: (data) => apiClient.put("/api/user/update", data),
};
