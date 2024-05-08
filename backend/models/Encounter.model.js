const { DataTypes } = require("sequelize");

module.exports= (sequelize, DataTypes) => {

    const Encounter = sequelize.define('Encounter', {
        // Model attributes are defined here
        visitId: { //should be auto incremented
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },   
        shiftId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        patientId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        dateTime: {
            type: DataTypes.DATE,
            default: Date.now()
        },
        tokenNo: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        doctorId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        bloodPressure: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        temperature: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        weight: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        BSR: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        heartRate: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        complaint: {
            type: DataTypes.STRING,
            allowNull: true
        },
        diagnosis: {
          type: DataTypes.STRING,
          allowNull: true
        },
        prescribedMeds: { //to make an array that stores medication ids
            type: DataTypes.JSON,
            allowNull: true
            // defaultValue: "",
            // get() {
            //     return this.getDataValue('prescribedMeds').split(';')
            // },
            // set(val) {
            //    this.setDataValue('prescribedMeds',val.join(';'));
            // },
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true
        },
        originalfee: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        discount: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        payable: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        paymentRecieved: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        balance: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        payStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
      }, {
        timestamps: false //this is to remove the createdAt and updatedAt timestamps that are otherwise created as default.
        // Other model options go here
      });

      return Encounter;
}