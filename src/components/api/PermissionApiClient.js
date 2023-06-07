import {authApi} from "boot/axios";

export function getRolesRequest(params) {
  return authApi.get("/permissions/",{params: params});
}


export function deletePermissionRequest(uuid) {
  return authApi.delete("/permissions/" + uuid);
}
