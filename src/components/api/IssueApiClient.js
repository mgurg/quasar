import {authApi} from "boot/axios";

export function getIssuesStatsRequest() {
  return authApi.get("/issues/stats");
}

export function getUserIssuesRequest(uuid) {
  return authApi.get("/issues/user/" + uuid);
}

export function getIssuesRequest(params) {
  return authApi.get("/issues/", {params: params});
}

export function getIssueRequest(uuid) {
  return authApi.get("/issues/" + uuid);
}

export function updateIssueRequest(uuid, data) {
  return authApi.patch("/issues/" + uuid, data);
}

export function createIssueRequest(data) {
  return authApi.post("/issues/", data);
}


export function deleteIssueRequest(uuid) {
  return authApi.delete("/issues/" + uuid);
}
