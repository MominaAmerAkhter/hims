const dbConfig = require('../config/dbConfig.js')

const {Sequelize, DataTypes} = require('sequelize')

const sequelize= new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    }
  }
)

sequelize.authenticate()
.then(() => {
  console.log("connected")
})
.catch(err => {
  console.log("Error" + err)
})

const db= {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.patients = require('./Patient.model.js')(sequelize, DataTypes)
db.users = require('./User.model.js')(sequelize, DataTypes)
db.encounters = require('./Encounter.model.js')(sequelize, DataTypes)
db.shifts = require('./Shift.model.js')(sequelize, DataTypes)
db.medicines = require('./Medicine.model.js')(sequelize, DataTypes)
db.doctors = require('./Doctor.model.js')(sequelize, DataTypes)
db.suppliers = require('./Supplier.model.js')(sequelize, DataTypes)
db.tradePrices = require('./TradePrice.model.js')(sequelize, DataTypes)
db.productRecInvoices = require('./ProductRecInvoice.model.js')(sequelize, DataTypes)
db.productSaleInvoices = require('./ProductSaleInvoice.model.js')(sequelize, DataTypes)
db.productRefunds = require('./ProductRefund.model.js')(sequelize, DataTypes)

db.sequelize.sync({ force:false})
.then(() => {
  console.log("re-sync complete")
})

module.exports= db