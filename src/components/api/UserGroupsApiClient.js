import {authApi} from "boot/axios";

export function getUsersGroupsRequest(params) {
  return authApi.get("/groups/", {params: params});
}


export function getUsersGroupRequest(uuid) {
  return authApi.get("/groups/" + uuid);
}

export function deleteUsersGroupRequest(uuid) {
  return authApi.delete("/groups/" + uuid);
}
