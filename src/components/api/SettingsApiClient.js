import {authApi} from "boot/axios";

export function getNotificationSettingsRequest() {
  return authApi.get("/settings/notifications/");
}

export function setNotificationSettingsRequest(data) {
  return authApi.post("/settings/notifications/", data);
}
