import startMirage from './start';

/**
* Start mirage to handle requests in development and production. Note
* that this file will _not_ be include in the build at all if mirage
* is disabled. Also, it will not included in test builds.
*/
window.mirage = startMirage(process.env.MIRAGE_SCENARIO);
