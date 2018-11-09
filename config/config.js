module.exports = {
  dev: {
    sqlconfig: {
      user: 'team4',
      password: 'Team4Wachtwoord',
      server: '141.134.155.219', // You can use 'localhost\\instance' to connect to named instance
      port: 1433,
      database: 'Mindfulness', //production
      options: {
        encrypt: true
      }
    }
  },
  prod: {

  }
}