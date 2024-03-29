// https://daily.dev/blog/a-Item-to-writing-clean-api-calls-using-axios
// https://blog.openreplay.com/making-api-calls-in-vue-with-axios/
// https://vuejsdevelopers.com/2017/08/28/vue-js-ajax-recipes/#pattern-5-from-a-service-module

import {api, authApi} from "boot/axios";

export function getManyItemsRequest(params) {
  return authApi.get("/items/", {params: params});
}

export function getOneItemRequest(uuid) {
  return authApi.get("/items/" + uuid);
}

export function getItemCsvRequest() {
  return authApi.get("/items/export", { responseType: 'stream' });
}
export function getItemTimelineRequest(uuid) {
  return authApi.get("/items/timeline/" + uuid, {params: {'action':'issue_add'}});
}

export function getItemStatisticsRequest(uuid, dateFrom, dateTo) {
  return authApi.get("/items/statistics/" + uuid,{params: {'date_from':dateFrom,"date_to":dateTo}});
}

export function getAllItemStatisticsRequest(dateFrom, dateTo) {
  return authApi.get("/items/statistics/all", {params: {'date_from':dateFrom,"date_to":dateTo}});
}

export function setItemFavouriteRequest(data) {
  return authApi.post("/items/favourites" , data);
}

export function getAnonymousItemUuidRequest(uuid, token, tenant_id) {
  return api.get("/items/" + uuid, {
    headers: {
      Authorization: "Bearer " + token,
      tenant: tenant_id,
    },
  });
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
