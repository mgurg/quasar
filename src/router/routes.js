const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
    children: [
      { path: "/todo", component: () => import("pages/Tasks/Todo.vue") },
      { path: "/task", component: () => import("pages/Tasks/TaskEdit.vue") },
      { path: "/view", component: () => import("pages/Tasks/TaskView.vue") },
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
