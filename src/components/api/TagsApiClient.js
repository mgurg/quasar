import {authApi} from "boot/axios";

// Notification
export function getTagsRequest(params) {
  return authApi.get("/tags/", {params: params});
}


export function addTagRequest(data) {
  return authApi.post("/tags/", data);
}

export function editTagRequest(uuid, data) {
  return authApi.patch("/tags/" + uuid, data);
}

export function deleteTagRequest(uuid) {
  return authApi.delete("/tags/" + uuid);
}
