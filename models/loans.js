'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loans = sequelize.define('Loans',  {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    book_id: {type:DataTypes.INTEGER, 
        underscored: true
      
      },
    patron_id: {type:DataTypes.INTEGER,
        underscored: true
      },
    loaned_on: {type:DataTypes.DATEONLY,
      validate:{
        notEmpty:{
          msg:'The Loaned On Date was empty'
        }
      }},
    return_by: {type: DataTypes.DATEONLY,
      validate:{
        notEmpty:{
          msg:'The Return By Date Was Empty'
        }
      }},
    returned_on: DataTypes.DATEONLY
  }, {timestamps: false});
  Loans.associate = function(models) {
    // associations can be defined here
   Loans.belongsTo(models.Books, {foreignKey: 'book_id' })
   Loans.belongsTo(models.Patrons, {foreignKey: 'patron_id' })

  };
  return Loans;
};