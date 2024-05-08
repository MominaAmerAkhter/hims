const { DataTypes } = require("sequelize");

module.exports= (sequelize, DataTypes) => {

    const Medicine = sequelize.define('Medicine', {
        // Model attributes are defined here
        medicineId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },         
        medicineName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        medicineType: {
          type: DataTypes.STRING,
          allowNull: false
        },
        supplierId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },     
        boxQuantity: {
          type: DataTypes.INTEGER,
          allowNull: true
        }, 
        unitPerBoxQuantity: {
          type: DataTypes.INTEGER,
          allowNull: true
        }, 
        retailPrice: {
          type: DataTypes.FLOAT,
          allowNull: true
        }
      }, {
        timestamps: false //this is to remove the createdAt and updatedAt timestamps that are otherwise created as default.
        // Other model options go here
      });

      return Medicine;
}