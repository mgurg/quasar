import {authApi} from "boot/axios";

const request = {
  async safe(funcCall, url, data) {
    let error = null;
    const response = await funcCall(url, data).catch(function (e) {
      // console.log(e); # TODO add simple error message logging?
      // Insert Generic Error Handling Here
      error = e;
      return null;
    });
    return {response, error, data: response?.data ?? null};
  },
};

function getRequests(axiosInstance) {
  return {
    async get(url, params = {}) {
      let error = null;
      const response = await axiosInstance.get(url, params).catch((e) => {
        error = e;
      });
      if (response != null) {
        return {response, error, data: response?.data};
      }
      return {response: null, error, data: null};
    },

    async post(url, data) {
      return await request.safe(axiosInstance.post, url, data);
    },

    async put(url, data) {
      return await request.safe(axiosInstance.put, url, data);
    },

    async patch(url, data) {
      return await request.safe(axiosInstance.patch, url, data);
    },

    async delete(url) {
      return await request.safe(axiosInstance.delete, url, undefined);
    },
  };
}

export const useAuthAPI = function () {
  return getRequests(authApi);
};
