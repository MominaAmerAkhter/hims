const { DataTypes } = require("sequelize");

module.exports= (sequelize, DataTypes) => {

    const Doctor = sequelize.define('Doctor', {
        // Model attributes are defined here
        // doctorId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        doctorfName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        doctorlName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        specialization: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        licenseNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        consultationFee: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        hospitalShare: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
      }, {
        timestamps: false //this is to remove the createdAt and updatedAt timestamps that are otherwise created as default.
        // Other model options go here
      });

      return Doctor;
}