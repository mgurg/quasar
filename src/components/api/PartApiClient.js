import {api, authApi} from "boot/axios";


export function getIssueUsedPartsRequest(uuid) {
  return authApi.get("/users/" + uuid);
}

export function createUsedPartsRequest(data) {
  return authApi.post("/parts/", data);
}
