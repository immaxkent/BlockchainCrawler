const consoleCustomiser = ({ delay, randomized }) => {
  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  return {
    log: async (s) => {
      for (const c of s) {
        process.stdout.write(c);
        await sleep((randomized ? Math.random() : 1) * delay);
      }
      process.stdout.write("\n");
    },
  };
};

module.exports = consoleCustomiser;
