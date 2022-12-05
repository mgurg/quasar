import { authApi } from "boot/axios";
import { api } from "boot/axios";



export function deleteFileRequest(uuid,token,tenant_id) {
  return api.delete("/files/" + uuid, {
    headers: {
      Authorization: "Bearer " + token,
      tenant: tenant_id,
    },
  });
}
