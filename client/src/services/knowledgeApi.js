import apiClient from "./apiClient";

export const knowledgeApi = {
  getActionItems: (status = "all") =>
    apiClient.get(`/api/knowledge/action-items?status=${status}`),
  getDecisionLineage: (decisionId) =>
    apiClient.get(`/api/knowledge/decisions/${decisionId}/lineage`),
};
