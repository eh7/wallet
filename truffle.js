module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    },
    eh7: {
      host: "10.0.0.7",
      port: 8501,
      network_id: "*",
      gas: 4000000
    }
  }
};
