import { Quasar } from "quasar";

export default async () => {
  const langIso = "de"; // ... some logic to determine it (use Cookies Plugin?)

  try {
    await import(
      /* webpackInclude: /(pl|de|en-US)\.js$/ */
      "quasar/lang/" + langIso
    ).then((lang) => {
      Quasar.lang.set(lang.default);
    });
  } catch (err) {
    console.log(err);
    // Requested Quasar Language Pack does not exist,
    // let's not break the app, so catching error
  }
};
