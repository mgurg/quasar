import { boot } from "quasar/wrappers";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
import { BrowserTracing } from "@sentry/tracing";

export default boot(({ Vue }) => {
  Sentry.init({
    dsn: process.env.VUE_SENTRY_DSN,
    integrations: [
      new BrowserTracing(),
      new Integrations.Vue({ Vue, attachProps: true }),
      new Integrations.RewriteFrames({
        iteratee(frame) {
          // Strip out the query part (which contains `?__WB_REVISION__=**`)
          frame.abs_path = frame.abs_path.split("?")[0];

          return frame;
        },
      }),
    ],
  });
});