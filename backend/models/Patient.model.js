const { Sequelize, Model, DataTypes } = require("sequelize");

module.exports= (sequelize, DataTypes) => {

    const Patient = sequelize.define('Patient', {
        patientId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },  
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },        
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        regDate: {
            type: DataTypes.DATE,
            default: Date.now()
          },
        phoneNumber: {
          type: DataTypes.STRING,
          allowNull: false
        },
        gender: {
          type: DataTypes.STRING,
          allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        houseAddress: {
            type: DataTypes.STRING,
            allowNull: false
        }
      }, {
        timestamps: false //this is to remove the createdAt and updatedAt timestamps that are otherwise created as default.
        // Other model options go here
      });

      return Patient;
}