import {authApi} from "boot/axios";

export function getRolesRequest() {
  return authApi.get("/permissions/");
}


export function deletePermissionRequest(uuid) {
  return authApi.delete("/permissions/" + uuid);
}
