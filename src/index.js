
/**
 * NOTES:
 *
 * On boot
 * 1. configResolved
 * 2. options
 * 3. configureServer
 * 4. buildStart
 * 5. handleHotUpdate
 *
 * On config file change (this file)
 * -5. configResolved
 * -4. options
 * -3. configureServer
 * -2. buildEnd
 * -1. closeBundle
 * 1. buildStart
 * 2. handleHotUpdate
 *
 * Whenever a browser tab is active
 * 1. transformIndexHTML (per HTML entry point (app, tests))
 *
 * Whenever a file is saved with no changes
 * 0. nothing -- however, if a browser tab is open, the above still holds true
 *
 * Whenever a file is saved with changes
 * 1. handleHotUpdate
 * 2. transformIndexHTML
 */

/**
 * Tracks the build time
 */
export function buildTime(callback) {

  if (!callback) {
    throw new Error(`A callback must be passed to the buildTime plugin. This callback will receive buildtime information`);
  }

  let lastStart;
  let finishedBoot = false;
  let lastUpdate;

  function reportTimes() {

    if (lastStart) {
      if (!finishedBoot) {
        finishedBoot = true;
        let duration = Date.now() - lastStart;
        /**
         * We have to set to null here because the time between HTML entrypoints is very close
         */
        lastStart = null;

        callback({
          duration,
          type: 'initial-build',
        });
      }
    }

    if (lastUpdate) {
      let duration = Date.now() - lastUpdate;
      lastUpdate = null;

      callback({
        duration,
        type: 'rebuild',
      });
    }
  }


  return {
    /**
     * Info about this plugin
     */
    name: 'vite-plugin-buildtime',


    /**
    * Vite plugin apis
    */
    hotUpdate() {
      lastUpdate = Date.now();
    },
    buildStart() {
      lastStart = Date.now();
      finishedBoot = false;
    },

    /**
     * Called each time an HTML entrypoint is output
     */
    transformIndexHTML() {
      reportTimes();
    },
    /**
    * NOTE: we can't use configureServer's 
    *     server.ws.on('connection'
    *     because the connection event doesn't fire if the tab isn't open.
    *     which means the build time will be perpetually delayed until the brower is focused
    *     (Chrome will aggressively deactivate tabs not in focus, for example)
    */
    configureServer(server) {
      server.ws.on('connection', () => {
        reportTimes();
      });
    },
  }
}
