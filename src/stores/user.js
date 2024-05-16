import {defineStore} from "pinia";
import {api, authApi} from "boot/axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    tokenValidTo: localStorage.getItem("tokenValidTo") || null,
    tenant: localStorage.getItem("tenant") || null,
    firstName: localStorage.getItem("firstName") || null,
    lastName: localStorage.getItem("lastName") || null,
    tz: localStorage.getItem("tz") || null,
    lang: localStorage.getItem("lang") || null,
    uuid: localStorage.getItem("uuid") || null,
    permissions: JSON.parse(localStorage.getItem("permissions")) || [],
    editorUsers: [],
    editorGroups: [],
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,

    getToken: (state) => state.token,
    getTenant: (state) => state.tenant,
    getTenantUuid: (state) => (state.tenant !== null && state.tenant.includes('_')) ? state.tenant.split('_').pop() : "null",

    getFullName: (state) => state.firstName + " " + state.lastName,
    getPermissions: (state) => state.permissions,

    getCurrentUserId: (state) => state.uuid,

    getEditorUsers: (state) => state.editorUsers,
    getEditorGroups: (state) => state.editorGroups,

  },
  actions: {
    increment() {
      this.counter++;
    },
    async loginUsers(response) {
      console.log(response)
      // localStorage.clear();
      sessionStorage.clear();
      localStorage.removeItem("token");
      localStorage.removeItem("tokenValidTo");
      localStorage.removeItem("tenant");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("tz");
      localStorage.removeItem("lang");
      localStorage.removeItem("uuid");
      localStorage.removeItem("permissions");

      this.token = response.auth_token;
      this.tokenValidTo = response.auth_token_valid_to;
      this.tenant = response.tenant_id;
      this.firstName = response.first_name;
      this.lastName = response.last_name;
      this.tz = response.tz;
      this.lang = response.lang;
      this.uuid = response.uuid;
      this.permissions = response.role_FK.permission.map((a) => a.name);

      // if (permanent == true) {
      //   localStorage.setItem("token", response.auth_token);
      //   sessionStorage.removeItem("token");
      // } else {
      //   sessionStorage.setItem("token", response.auth_token);
      //   localStorage.removeItem("token");
      // }

      localStorage.setItem("token", response.auth_token);
      localStorage.setItem("tenant", response.tenant_id);
      localStorage.setItem("tokenValidTo", response.auth_token_valid_to);
      localStorage.setItem("lang", response.lang);
      localStorage.setItem("firstName", response.first_name);
      localStorage.setItem("lastName", response.last_name);
      localStorage.setItem("tz", response.tz);
      localStorage.setItem("lang", response.lang);
      localStorage.setItem("uuid", response.uuid);
      localStorage.setItem("permissions", JSON.stringify(response.role_FK.permission.map((a) => a.name)));
      return true;
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
      let token = null;
      let tenant_id = null;

      if (this.token !== null) {
        token = this.token
        console.log('Token From Store');
      }

      if (token == null && localStorage.getItem("token") !== null) {
        token = localStorage.getItem("token")
        console.log('Token From localStorage');
      }

      if (this.tenant !== null) {
        tenant_id = this.tenant
        console.log('Tenant From Store');
      }

      if (token == null && localStorage.getItem("tenant") !== null) {
        tenant_id = localStorage.getItem("tenant")
        console.log('Token From localStorage');
      }

      console.log(token)
      console.log(tenant_id)

      if (token !== null && tenant_id !== null) {
        await api
          .get("/auth/verify/" + token, {
            headers: {
              tenant: tenant_id,
            },
          })
          .then((response) => {
            console.log('verify result')
            console.log(response.data)

            this.token = token;
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response.data.detail);
            } else if (err.request) {
              console.log(err.request);
            } else {
              console.log("General Error");
            }
            this.logoutUser();
          });
      } else {
        await this.logoutUser();
      }
    },

    async logoutUser() {
      localStorage.removeItem("token");
      localStorage.removeItem("tenant");
      localStorage.removeItem("tokenValidTo");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("tz");
      localStorage.removeItem("lang");
      localStorage.removeItem("uuid");
      localStorage.removeItem("permissions");

      localStorage.clear();
      sessionStorage.clear();

      this.token = null;
      this.tenant = null;
      this.tokenValidTo = null;
      this.tenant = null;
      this.firstName = null;
      this.lastName = null;
      this.tz = null;
      this.lang = null;
      this.uuid = null;
      this.permissions = null;
    },
  },
});
