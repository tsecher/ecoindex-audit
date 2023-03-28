const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on("before:browser:launch", (_browser, launchOptions) => {
        const remoteDebuggingPort = launchOptions.args.find((config) => config.startsWith("--remote-debugging-port"));
        const remoteDebuggingAddress = launchOptions.args.find((config) =>
            config.startsWith("--remote-debugging-address")
        );
        if (remoteDebuggingPort) {
            global.remote_debugging_port = remoteDebuggingPort.split("=")[1];
        }
        if (remoteDebuggingAddress) {
            global.remote_debugging_address = remoteDebuggingAddress.split("=")[1];
        }
    });

      on('task', {
        async checkEcoIndex({url} = {}) {
          const check = require("./src/main");
          return await check({
              url: url,
              remote_debugging_port: global.remote_debugging_port,
              remote_debugging_address: global.remote_debugging_address,
            },
            true
          );
        }
      })
    },
  },
});
