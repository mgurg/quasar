const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
    children: [
      { path: "/tasks", component: () => import("pages/Tasks/TaskIndex.vue") },
      { path: "/tasks/add", component: () => import("pages/Tasks/TaskEdit.vue") },
      {
        path: "/tasks/:uuid",
        component: () => import("pages/Tasks/TaskView.vue"),
      },
      {
        path: "/tasks/edit/:uuid",
        component: () => import("pages/Tasks/TaskEdit.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
