import {authApi} from "boot/axios";

// https://stackoverflow.com/a/70337392
// https://medium.com/bb-tutorials-and-thoughts/how-to-make-parallel-api-calls-in-vuejs-applications-typescript-version-c3356814ecbf


// export const getCallTrace = async (callUuid: string) => {
//   const {data} = await authCrmAxios.get < {data: Track[]} > (
//     `callHistory/trace/${callUuid}`
//   );
//
//   return data.data;
// };

export function getIdeasStatsRequest() {
  return authApi.get("/ideas/stats");
}

export function getUserIdeasRequest(uuid) {
  return authApi.get("/ideas/user/" + uuid);
}

export function getIdeasRequest(params) {
  return authApi.get("/ideas/", {params: params});
}

export function getIdeaRequest(uuid) {
  return authApi.get("/ideas/" + uuid);
}

export function updateIdeaRequest(uuid, data) {
  return authApi.patch("/ideas/" + uuid, data);
}

export function createIdeaRequest(data) {
  return authApi.post("/ideas/", data);
}


export function deleteIdeaRequest(uuid) {
  return authApi.delete("/ideas/" + uuid);
}
