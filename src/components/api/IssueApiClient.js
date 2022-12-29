import {authApi} from "boot/axios";

export function getIssuesStatsRequest() {
  return authApi.get("/issues/stats");
}

export function getUserIssuesRequest(uuid) {
  return authApi.get("/issues/user/" + uuid);
}

export function getManyIssuesRequest(params) {
  return authApi.get("/issues/", {params: params});
}

export function getOneIssueRequest(uuid) {
  return authApi.get("/issues/" + uuid);
}

export function editIssueRequest(uuid, data) {
  return authApi.patch("/issues/" + uuid, data);
}

export function addIssueRequest(data) {
  return authApi.post("/issues/", data);
}

export function changeIssueStatusRequest(uuid, data) {
  return authApi.post("/issues/status/" + uuid, data);
}

export function deleteIssueRequest(uuid) {
  return authApi.delete("/issues/" + uuid);
}
