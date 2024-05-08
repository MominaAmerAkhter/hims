const { DataTypes } = require("sequelize");

module.exports= (sequelize, DataTypes) => {

    const TradePrice = sequelize.define('TradePrice', {
        productId: { 
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        supplierId: { 
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        boxTradePrice: {
          type: DataTypes.STRING,
          allowNull: false
        },
        unitTradePrice: {
            type: DataTypes.STRING,
            allowNull: false
        }
      }, {
        timestamps: false //this is to remove the createdAt and updatedAt timestamps that are otherwise created as default.
        // Other model options go here
      });

      return TradePrice;
}