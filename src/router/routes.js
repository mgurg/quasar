
const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("pages/Auth/Login.vue"),
    meta: {
      requiresNoAuth: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("pages/Auth/Login.vue"),
    meta: {
      requiresNoAuth: true,
    },
  },
  {
    path: "/new_account",
    name: "new_account",
    component: () => import("pages/Auth/NewAccount.vue"),
    meta: {
      requiresNoAuth: true,
    },
  },
  {
    path: "/activate/:id",
    name: "newAccount",
    component: () => import("pages/Auth/FirstRun.vue"),
    meta: {
      requiresNoAuth: true,
    },
  },
  {
    path: "/reset_password",
    name: "resetPassword",
    component: () => import("pages/Auth/Login.vue"),
    meta: {
      requiresNoAuth: true,
    },
  },
  // {
  //   path: "/map",
  //   name: "map",
  //   component: () => import("pages/Map/MapMapIndex.vue"),
  //   meta: {
  //     requiresNoAuth: true,
  //   },
  // },
  // {
  //   path: "/maps",
  //   name: "maps",
  //   component: () => import("pages/Map/MapImgIndex.vue"),
  //   meta: {
  //     requiresNoAuth: true,
  //   },
  // },

  {
    path: "/voice",
    name: "voice2",
    component: () => import("pages/Files/Voice2.vue"),
    meta: {
      requiresNoAuth: true,
    },
  },
  {
    path: "/new/:id?",
    name: "newIdea",
    component: () => import("pages/PublicOpen/NewIdea.vue"),
    meta: {
      requiresNoAuth: true,
    },
  },
  {
    path: "/new_submission",
    name: "NewSubmission",
    component: () => import("pages/PublicOpen/NewSubmission.vue"),
    meta: {
      requiresNoAuth: true,
    },
  },
  // {
  //   path: "/qr",
  //   name: "qr",
  //   component: () => import("pages/PublicOpen/Qr.vue"),
  //   meta: {
  //     requiresNoAuth: true,
  //   },
  // },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: "/home", component: () => import("pages/Home/Dashboard.vue") },

      { path: "/users", component: () => import("pages/Users/UserIndex.vue") },
      { path: "/users/add", component: () => import("pages/Users/UserAdd.vue") },
      { path: "/users/:uuid", component: () => import("pages/Users/UserView.vue") },
      { path: "/users/edit/:uuid", component: () => import("pages/Users/UserEdit.vue") },

      { path: "/ideas", component: () => import("pages/Ideas/IdeaIndex.vue") },
      { path: "/ideas/add", component: () => import("pages/Ideas/IdeaAdd.vue") },
      { path: "/ideas/:uuid", component: () => import("pages/Ideas/IdeaView.vue") },
      { path: "/ideas/user/:uuid", component: () => import("pages/Ideas/IdeaUserIndex.vue") },

      { path: "/settings", component: () => import("pages/Settings/SettingsIndex.vue") },
      { path: "/settings/ideas", component: () => import("pages/Settings/SettingsIdea.vue") },
      { path: "/settings/permissions", component: () => import("pages/Settings/SettingsPermissionsIndex.vue") },
      { path: "/settings/permissions/add", component: () => import("pages/Settings/SettingsPermissionsView.vue") },
      { path: "/settings/permissions/:uuid", component: () => import("pages/Settings/SettingsPermissionsView.vue") },
      { path: "/settings/groups", component: () => import("pages/Settings/SettingsGroups.vue") },

      // { path: "/tasks", component: () => import("pages/Tasks/TaskIndex.vue") },
      // { path: "/tasks/add", component: () => import("pages/Tasks/TaskAdd.vue") },
      // { path: "/tasks/:uuid", component: () => import("pages/Tasks/TaskView.vue") },
      // { path: "/tasks/edit/:uuid", component: () => import("pages/Tasks/TaskEdit.vue") },
      { path: "/files", component: () => import("pages/Files/FileIndex.vue") },
      { path: "/editor", component: () => import("pages/Editor/EditorIndex.vue") },

      // { path: "/layout", component: () => import("pages/Maps/MapIndex.vue") },
      // {
      //   path: "/calendar",
      //   component: () => import("pages/Calendar/Month.vue"),
      // },
      // { path: '', component: () => import('pages/IndexPage.vue') }
      { path: '', component: () => import('pages/Home/Dashboard.vue') }
    ],
    meta: {
      requiresAuth: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
