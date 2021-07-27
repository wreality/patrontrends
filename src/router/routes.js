const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      {
        path: ":slug",
        props: true,
        component: () => import("pages/Index.vue"),
      },
    ],
  },
  {
    path: "/stream/:slug",
    props: true,
    component: () => import("pages/Stream.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
]

export default routes
