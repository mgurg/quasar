import { authApi } from "boot/axios";

export function getVerifyTokenRequest(token) {
  return authApi.get("/auth/verify/" + token);
}

export function authFirstRunRequest(activationId) {
  return authApi.post("auth/first_run", {"token": activationId});
}