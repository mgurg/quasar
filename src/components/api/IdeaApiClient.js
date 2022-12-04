import { authApi } from "boot/axios";

export function getIdeasStatsRequest() {
  return authApi.get("/ideas/stats");
}

export function getUserIdeasRequest(uuid) {
  return authApi.get("/ideas/user/"+uuid);
}

export function getIdeasRequest(params) {
  return authApi.get("/ideas/", {params: params});
}

export function deleteIdeaRequest(uuid) {
  return authApi.delete("/ideas/" + uuid);
}
