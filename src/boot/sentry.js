import { boot } from "quasar/wrappers";
// import * as Sentry from "@sentry/browser";
// import * as Integrations from "@sentry/integrations";
// import { BrowserTracing } from "@sentry/tracing";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

export default boot(({ app, router }) => {

  if (process.env.VUE_MODE != "production") {
    console.log(`I'm on a development build`)
  }

  if (process.env.VUE_MODE == "production" && process.env.VUE_SENTRY_DSN) {
    console.log(`I'm on a production build`)
    Sentry.init({
      app,
      dsn: process.env.VUE_SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracingOrigins: ["localhost", "remontmaszyn.pl", /^\//],
        }),
      ],
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });

    // Sentry.init({
    //   app,
    //   dsn: process.env.VUE_SENTRY_DSN,
    //   integrations: [
    //     new BrowserTracing({
    //       routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    //       tracingOrigins: ['localhost', /^\//],
    //     }),
    //   ],
    //   // environment: process.env.NODE_ENV,
    //   tracesSampleRate: 1.0,
    // });

    // export default boot(({ Vue }) => {
    // Sentry.init({
    //   dsn: process.env.VUE_SENTRY_DSN,
    //   environment: process.env.NODE_ENV,
    //   integrations: [
    //     new BrowserTracing(),
    //     new Integrations.Vue({ Vue, attachProps: true }),
    //     new Integrations.RewriteFrames({
    //       iteratee(frame) {
    //         // Strip out the query part (which contains `?__WB_REVISION__=**`)
    //         frame.abs_path = frame.abs_path.split("?")[0];
  
    //         return frame;
    //       },
    //     }),
    //   ],
    // });

  }

});