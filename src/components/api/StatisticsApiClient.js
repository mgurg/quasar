import {authApi} from "boot/axios";

export function getIssuesCounterRequest() {
  return authApi.get("/statistics/issues_counter/");
}

export function getFirstStepsRequest() {
  return authApi.get("/statistics/first_steps");
}
