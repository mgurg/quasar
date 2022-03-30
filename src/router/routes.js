
const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("pages/Auth/Login"),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: "/tasks", component: () => import("pages/Tasks/TaskIndex.vue") },
      {
        path: "/tasks/add",
        component: () => import("pages/Tasks/TaskAdd.vue"),
      },
      {
        path: "/tasks/:uuid",
        component: () => import("pages/Tasks/TaskView.vue"),
      },
      {
        path: "/tasks/edit/:uuid",
        component: () => import("pages/Tasks/TaskEdit.vue"),
      },
      { path: "/files", component: () => import("pages/Files/FileIndex.vue") },
      { path: "/editor", component: () => import("pages/Editor/EditorIndex.vue") },
      { path: "/home", component: () => import("pages/Home/Dashboard.vue") },
      {
        path: "/calendar",
        component: () => import("pages/Calendar/Month.vue"),
      },
      { path: '', component: () => import('pages/IndexPage.vue') }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
