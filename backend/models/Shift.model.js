const { DataTypes } = require("sequelize");

module.exports= (sequelize, DataTypes) => {

    const Shift = sequelize.define('Shift', {
        // Model attributes are defined here
        shiftId: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },  
        shiftCreator: {
          type: DataTypes.STRING,
          allowNull: false
        }, 
        doctorId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },        
        doctorfName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        doctorlName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        shiftStatus: {
          type: DataTypes.STRING,
          allowNull: false
        },
        startTime: {
          type: DataTypes.DATE,
          default: Date.now()
        },
        endTime: {
          type: DataTypes.DATE,
          allowNull: true
          
        }
      }, {
        timestamps: false //this is to remove the createdAt and updatedAt timestamps that are otherwise created as default.
        // Other model options go here
      });

      return Shift;
}