const { Sequelize } = require('sequelize');
const express = require('express');
const jwt= require('jsonwebtoken')
const cors = require('cors')
const dotenv = require('dotenv')

const app = express();

dotenv.config({ path: './.env'})


const port = process.env.PORT || 4000;
var corOptions = {
  origin: true //'https://localhost:4000'
}


const sequelize = new Sequelize('medics_new_db', 'root', 'medicsclinic', {
  host: 'localhost',
  dialect: 'mysql'
});

const db= require('./models')
const patientsRoutes= require('./routes/patient')
const usersRoutes= require('./routes/user')
const shiftRoutes= require('./routes/shift')
const medicineRoutes= require('./routes/medicine')
const encounterRoutes= require('./routes/encounter')
const doctorRoutes= require('./routes/doctor')
const supplierRoutes= require('./routes/supplier')
const tradePriceRoutes= require('./routes/tradePrice')
const productRecInvoiceRoutes= require('./routes/productRecInvoice')
const productSaleInvoiceRoutes= require('./routes/productSaleInvoice')
const productRefundRoutes= require('./routes/productRefund')

//middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use('/patient', patientsRoutes)
app.use('/user', usersRoutes)
app.use('/shift', shiftRoutes)
app.use('/medicine', medicineRoutes)
app.use('/encounter', encounterRoutes)
app.use('/doctor', doctorRoutes)
app.use('/supplier', supplierRoutes)
app.use('/tradePrice', tradePriceRoutes)
app.use('/productRecInvoice', productRecInvoiceRoutes)
app.use('/productSaleInvoice', productSaleInvoiceRoutes)
app.use('/productRefund', productRefundRoutes)


db.sequelize.sync().then((req) =>{

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
        console.log(process.env.NODE_ENV)
      });
})


  

