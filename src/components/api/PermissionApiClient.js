import { authApi } from "boot/axios";

export function getRolesRequest() {
  return authApi.get("/ideas/stats");
}
