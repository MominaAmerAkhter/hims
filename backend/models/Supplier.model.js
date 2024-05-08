const { DataTypes } = require("sequelize");

module.exports= (sequelize, DataTypes) => {

    const Supplier = sequelize.define('Supplier', {
        supplierId: { //should be auto incremented
            type: DataTypes.INTEGER,
            primaryKey: true
        }, 
        supplierName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        supplierPhone: {
          type: DataTypes.STRING,
          allowNull: false
        },
        companyName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        supplierAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        companyPhone: {
            type: DataTypes.STRING,
            allowNull: false
        },
      }, {
        timestamps: false //this is to remove the createdAt and updatedAt timestamps that are otherwise created as default.
        // Other model options go here
      });

      return Supplier;
}