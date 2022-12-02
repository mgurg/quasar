import { authApi } from "boot/axios";

export function getIdeasStatsRequest() {
  return authApi.get("/ideas/stats");
}

export function getUserIdeasRequest(uuid) {
  return authApi.get("/ideas/user/"+uuid);
}
