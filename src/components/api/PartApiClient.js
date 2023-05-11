import {api, authApi} from "boot/axios";


export function getIssueUsedPartsRequest(uuid) {
  return authApi.get("/parts/issue/" + uuid);
}

export function createUsedPartsRequest(data) {
  return authApi.post("/parts/", data);
}

export function deleteUsedPartsRequest(uuid) {
  return authApi.delete("/parts/" + uuid);
}
