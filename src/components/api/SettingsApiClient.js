import {authApi} from "boot/axios";

// Notification
export function getNotificationSettingsRequest() {
  return authApi.get("/settings/notifications/");
}


export function setNotificationSettingsRequest(data) {
  return authApi.post("/settings/notifications/", data);
}

// User
export function getUserSettingRequest(settting) {
  return authApi.get("/settings/?settings=" + settting);
}

export function setUserSettingsRequest(data) {
  return authApi.post("/settings/", data);
}

export function setUserLangSettingsRequest(data) {
  return authApi.post("/settings/user_lang/", data);
}
