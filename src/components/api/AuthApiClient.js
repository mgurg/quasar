//  https://github.com/search?q=useAsyncLoad+lang%3AVue+&type=code

import { api, authApi } from "boot/axios";


export function getVerifyTokenRequest(token) {
  return authApi.get("/auth/verify/" + token);
}

export function authFirstRunRequest(activationId) {
  return authApi.post("auth/first_run", {"token": activationId});
}

export function resolveQRtoURL(qrId) {
  return api.post("auth/qr/"+qrId);
}
