
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
  {
    path: "/qr/:qr",
    name: "qr",
    component: () => import("pages/PublicOpen/Qr.vue"),
    meta: {
      requiresNoAuth: true,
    },
  },
  {
    path: "/public/guides/:uuid",
    name: "publicGuides",
    component: () => import("pages/PublicOpen/PublicGuideView.vue"),
    meta: {
      requiresNoAuth: true,
    },
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: "/home", component: () => import("pages/Home/Dashboard.vue") },

      { path: "/issues", component: () => import("pages/Issues/IssueIndex.vue") },
      { path: "/issues/add", component: () => import("pages/Issues/IssueAdd.vue") },
      { path: "/issues/:uuid", component: () => import("pages/Issues/IssueView.vue") },
      { path: "/issues/user/:uuid", component: () => import("pages/Issues/IssueUserIndex.vue") },
      { path: "/issues/edit/:uuid", component: () => import("pages/Issues/IssueEdit.vue") },

      { path: "/users", component: () => import("pages/Users/UserIndex.vue") },
      { path: "/users/add", component: () => import("pages/Users/UserAdd.vue") },
      { path: "/users/:uuid", component: () => import("pages/Users/UserView.vue") },
      { path: "/users/edit/:uuid", component: () => import("pages/Users/UserEdit.vue") },

      { path: "/ideas", component: () => import("pages/Ideas/IdeaIndex.vue") },
      { path: "/ideas/add", component: () => import("pages/Ideas/IdeaAdd.vue") },
      { path: "/ideas/:uuid", component: () => import("pages/Ideas/IdeaView.vue") },
      { path: "/ideas/user/:uuid", component: () => import("pages/Ideas/IdeaUserIndex.vue") },
      { path: "/ideas/edit/:uuid", component: () => import("pages/Ideas/IdeaEdit.vue") },

      { path: "/guides", component: () => import("pages/Guides/GuideIndex.vue") },
      { path: "/guides/add", component: () => import("pages/Guides/GuideAdd.vue") },
      { path: "/guides/:uuid", component: () => import("pages/Guides/GuideView.vue") },
      { path: "/guides/edit/:uuid", component: () => import("pages/Guides/GuideEdit.vue") },

      { path: "/failure/:uuid", component: () => import("pages/Failure/FailureReport.vue") },

      { path: "/items", component: () => import("pages/Items/ItemsIndex.vue") },
      { path: "/items/add", component: () => import("pages/Items/ItemsAdd.vue") },
      { path: "/items/:uuid", component: () => import("pages/Items/ItemsView.vue") },
      { path: "/items/edit/:uuid", component: () => import("pages/Items/ItemsEdit.vue") },
      { path: "/items/summary/", component: () => import("pages/Items/ItemsReports.vue") },

      { path: "/settings", component: () => import("pages/Settings/SettingsIndex.vue") },
      { path: "/settings/tags", component: () => import("pages/Settings/SettingsTags.vue") },
      { path: "/settings/import-export", component: () => import("pages/Settings/SettingsExportImport.vue") },
      { path: "/settings/account", component: () => import("pages/Settings/SettingsAccount.vue") },
      { path: "/settings/notifications", component: () => import("pages/Settings/SettingsNotifications.vue") },
      { path: "/settings/permissions", component: () => import("pages/Settings/SettingsPermissionsIndex.vue") },
      { path: "/settings/permissions/:mode", component: () => import("pages/Settings/SettingsPermissionsView.vue") },
      { path: "/settings/permissions/:mode/:uuid", component: () => import("pages/Settings/SettingsPermissionsView.vue") },

      { path: "/settings/groups", component: () => import("pages/Settings/SettingsGroupsIndex.vue") },
      { path: "/settings/groups/add", name:"SettingsGroupsView", component: () => import("pages/Settings/SettingsGroupsView.vue") },
      { path: "/settings/groups/:mode/:uuid", component: () => import("pages/Settings/SettingsGroupsView.vue") },

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
