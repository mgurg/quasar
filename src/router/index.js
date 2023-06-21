import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import { useUserStore } from 'stores/user'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  const UserStore = useUserStore()
  // console.log('Router is ' , UserStore.isAuthenticated)

  Router.onError(error => {
    // https://github.com/ProtoSchool/protoschool.github.io/issues/555
    // When a user comes back to a tab with ProtoSchool open after a deployment,
    // they might get this ChunkLoadError error
    // because the chunk's name does not exist anymore (because of cache busting hashes in the filenames).
    // When it happens, we can force the page to reload and the new files will
    // fetched instead.
    if (error.name === 'ChunkLoadError') {
      console.warn('Failed to load chunk due to new version of the website published - will reload page')
  
      Router.app.$notify.error("Błąd ładowania - odśwież stronę");
      window.location.pathname = nextRoute ? nextRoute.path : window.location.pathname
      window.location.reload(true);
    }
  })
  

  Router.beforeEach((to, from, next) => {
    if(to.meta.requiresAuth && !UserStore.isAuthenticated){
      next('/login');
    // } else if (to.meta.requiresNoAuth && UserStore.isAuthenticated) {
    //   next('/files');
    } else{
      next();
    }
    // console.log('req ' + to.meta.requiresAuth);
    // console.log('is ' + store.store.getters["authModule/isAuthenticated"]);

  })

  return Router
})
