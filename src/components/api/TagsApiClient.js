import {authApi} from "boot/axios";

// Notification
export function getTagsRequest() {
  return authApi.get("/tags/");
}


export function addTagRequest(data) {
  return authApi.post("/tags/", data);
}

export function deleteTagRequest(uuid) {
  return authApi.delete("/users/" + uuid);
}
