import {api, authApi} from "boot/axios";

// export function getIssuesStatsRequest() {
//   return authApi.get("/issues/stats");
// }

export function getIssueTimelineRequest(uuid) {
  return authApi.get("/issues/timeline/" + uuid);
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


export function addAnonymousIssueRequest(data, token, tenant_id) {
  return api.post("/issues/", data, {
    headers: {
      Authorization: "Bearer " + token,
      tenant: tenant_id,
    },
  });
}

export function changeIssueStatusRequest(uuid, data) {
  return authApi.post("/issues/status/" + uuid, data);
}

export function deleteIssueRequest(uuid) {
  return authApi.delete("/issues/" + uuid);
}
