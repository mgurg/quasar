// https://daily.dev/blog/a-Item-to-writing-clean-api-calls-using-axios
// https://blog.openreplay.com/making-api-calls-in-vue-with-axios/
// https://vuejsdevelopers.com/2017/08/28/vue-js-ajax-recipes/#pattern-5-from-a-service-module

import { authApi } from "boot/axios";

export function getItemsRequest() {
  return authApi.get("/items/");
}

export function getItemRequest(params) {
  return authApi.get("/items/", { params: params });
}

export function getItemUuidRequest(uuid) {
  return authApi.get("/items/"+ uuid);
}

export function addItemRequest(data) {
  return authApi.post("/items/", data);
}

export function editItemRequest(uuid, data) {
  return authApi.patch("/items/" + uuid, data);
}

export function deleteItemRequest(uuid) {
    return authApi.delete("/items/" + uuid);
  }
