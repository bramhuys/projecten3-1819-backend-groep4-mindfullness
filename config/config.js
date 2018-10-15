module.exports = {
    dev: {
      port: process.env.port || 3000,
      db  : process.env.DB_LINK || "mongodb://141.134.155.219:27017/TestDB"
      // db  : process.env.DB_LINK || "mongodb://localhost:27017/TestDB"
    },
    prod: {
        
    }
  }