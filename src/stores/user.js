import { defineStore } from "pinia";
import { api, authApi } from "boot/axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    tenant: localStorage.getItem("tenant") || null,
    permissions: JSON.parse(localStorage.getItem("permissions")) || [],
    firstName: localStorage.getItem("firstName") || null,
    lastName: localStorage.getItem("lastName") || null,
    tz: localStorage.getItem("tz") || null,
    lang: localStorage.getItem("lang") || null,
    uuid: localStorage.getItem("uuid") || null,
    editorUsers : [],
    editorGroups : [],
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,

    getToken: (state) => state.token,
    getTenant: (state) => state.tenant,
    getTenantUuid: (state) => (state.tenant !== null && state.tenant.includes('_')) ? state.tenant.split('_').pop() : "null",

    getFullName : (state) => state.firstName + " " + state.lastName,
    getPermissions: (state) => state.permissions,

    getCurrentUserId: (state) => state.uuid,

    getEditorUsers: (state) => state.editorUsers,
    getEditorGroups: (state) => state.editorGroups,

  },
  actions: {
    increment() {
      this.counter++;
    },
    async loginUsers(email, password, permanent) {
      try {
        const body = {
          email: email,
          password: password,
          permanent: permanent,
        };


        const data = await api.post("/auth/login", body);
        console.log('LOGGING');
        console.log(data.data);

        this.token = data.data.auth_token;
        this.tenant = data.data.tenant_id;
        this.firstName = data.data.first_name;
        this.lastName = data.data.last_name;
        this.tz = data.data.tz;
        this.lang = data.data.lang;
        this.uuid = data.data.uuid;
        this.permissions = data.data.role_FK.permission.map((a) => a.name);

        if (permanent == true) {
          localStorage.setItem("token", data.data.auth_token);
          sessionStorage.removeItem("token");
        } else {
          sessionStorage.setItem("token", data.data.auth_token);
          localStorage.removeItem("token");
        }
        localStorage.removeItem("token");
        localStorage.removeItem("tz");
        localStorage.removeItem("lang");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("uuid");
        localStorage.removeItem("tenant");

        sessionStorage.removeItem("token");
        localStorage.setItem("token", data.data.auth_token);
        localStorage.setItem("tenant",data.data.tenant_id);
        localStorage.setItem("tz", data.data.tz);
        localStorage.setItem("lang", data.data.lang);
        localStorage.setItem("firstName", data.data.first_name);
        localStorage.setItem("lastName", data.data.last_name);
        localStorage.setItem("uuid", data.data.uuid);
        localStorage.setItem("permissions", JSON.stringify(data.data.role_FK.permission.map((a) => a.name)));
        return "OK";
      } catch (error) {
        // alert(error)
        // console.log(error.data)
        // throw error;
        if (error.response) {
          console.log(error.response.data.detail);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("General Error");
        }
        throw error.response.data.detail;
      }
    },

  async setEditorUsers() {
    const data = await authApi.get("/users/")
    const users = data.data.items;
    const usersWithFullName = users.map(users => ({
      uuid: `${users.uuid}`,
      label: `${users.first_name} ${users.last_name}`
    }));

    this.editorUsers = usersWithFullName;
  },

  async setEditorGroups() {
    const data = await authApi.get("/groups/")
    const groups = data.data.items;
    const groupsWithLabel = groups.map(groups => ({
      uuid: `${groups.uuid}`,
      label: `${groups.name}`
    }));

    this.editorGroups = groupsWithLabel;
  },

    fillStore(token, tenant, firstName, lastName, uuid, tz, lang) {
      this.token = token;
      this.tenant = tenant;
      this.firstName = firstName;
      this.lastName = lastName;
      this.tz = tz;
      this.lang = lang;
      this.uuid = uuid;
    },

    async autoLogin() {
      let token = null

      if (this.token !== null){
        token = this.token
        console.log('Token From Store');
      }
      if(token == null && sessionStorage.getItem("token") !== null){
        token = sessionStorage.getItem("token");
        console.log('Token From sessionStorage');
      }

      if(token == null && localStorage.getItem("token") !== null){
        token = localStorage.getItem("token")
        console.log('Token From localStorage');
      }

      if (token !== null) {
        await api
          .get("/auth/verify/" + token)
          .then((res) => {
            if (res.data.ok == true) {
              this.token = token;
            } else {
              this.logoutUser();
            }
            // return('OK');
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response.data.detail);
            } else if (err.request) {
              console.log(err.request);
            } else {
              console.log("General Error");
            }
          });
      } else{
        await this.logoutUser();
      }
    },

    async logoutUser() {
      localStorage.removeItem("token");
      localStorage.removeItem("tz");
      localStorage.removeItem("lang");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("uuid");
      localStorage.removeItem("permissions");
      localStorage.removeItem("tenant");
      sessionStorage.removeItem("token");
      this.token = null;
      this.tenant = null;
    },
  },
});
