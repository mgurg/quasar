import {api, authApi} from "boot/axios";


export function deleteFileRequest(uuid, token, tenant_id) {
  return api.delete("/files/" + uuid, {
    headers: {
      Authorization: "Bearer " + token,
      tenant: tenant_id,
    },
  });
}


export function getUsedSpaceRequest() {
  return authApi.get("/files/used_space");
}
