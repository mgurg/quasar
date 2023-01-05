import {authApi} from "boot/axios";

export function getUsersRequest(params) {
  return authApi.get("/users/", {params: params});
}

export function getUserRequest(uuid) {
  return authApi.get("/users/" + uuid);
}

export function createUserRequest(data) {
  return authApi.post("/users/", data);
}

export function updateUserRequest(uuid, data) {
  return authApi.patch("/users/" + uuid, data);
}

export function activateUserRequest(uuid) {
  return authApi.patch("/users/" + uuid, {"is_verified": true});
}

export function deleteUserRequest(uuid) {
  return authApi.delete("/users/" + uuid);
}
