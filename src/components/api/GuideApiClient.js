// https://daily.dev/blog/a-guide-to-writing-clean-api-calls-using-axios
// https://blog.openreplay.com/making-api-calls-in-vue-with-axios/
// https://vuejsdevelopers.com/2017/08/28/vue-js-ajax-recipes/#pattern-5-from-a-service-module

import {authApi} from "boot/axios";

export function getGuidesRequest() {
  return authApi.get("/guides/");
}

export function getGuideRequest(params) {
  return authApi.get("/guides/", {params: params});
}

export function getAnonymousItemGuidesRequest(params, token, tenant_id) {
  return api.get("/guides/",{params: params}, {
    headers: {
      Authorization: "Bearer " + token,
      tenant: tenant_id,
    },
  });
}

export function addGuideRequest(data) {
  return authApi.post("/guides/", data);
}

export function updateGuideRequest(uuid, data) {
  return authApi.patch("/guides/" + uuid, data);
}

export function deleteGuideRequest(uuid) {
  return authApi.delete("/guides/" + uuid);
}
