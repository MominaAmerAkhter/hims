const { DataTypes } = require("sequelize");

module.exports= (sequelize, DataTypes) => {

    const ProductRecInvoice = sequelize.define('ProductRecInvoice', {
        // Model attributes are defined here
        dateTime: {
            type: DataTypes.DATE,
            default: Date.now()
        },
        supplierId: { 
            type: DataTypes.INTEGER,
            allowNull: false
        },   
        overallDiscount: {
            type: DataTypes.FLOAT,
            allowNull: false
        }, 
        grandTotal: {
            type: DataTypes.FLOAT,
            allowNull: false
        }, 
        products: { 
            type: DataTypes.JSON,
            allowNull: true
        },

      }, {
        timestamps: false //this is to remove the createdAt and updatedAt timestamps that are otherwise created as default.
        // Other model options go here
      });

      return ProductRecInvoice;
}