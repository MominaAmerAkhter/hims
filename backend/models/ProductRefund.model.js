const { DataTypes } = require("sequelize");

module.exports= (sequelize, DataTypes) => {

    const ProductRefund = sequelize.define('ProductRefund', {
        // Model attributes are defined here
        dateTime: {
            type: DataTypes.DATE,
            default: Date.now()
        },
        patientPhone: { 
            type: DataTypes.STRING,
            allowNull: false
        },   
        refundedAmount: {
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

      return ProductRefund;
}