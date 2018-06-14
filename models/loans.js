'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loans = sequelize.define('Loans',  {
    id: {type: DataTypes.INTEGER,
     primaryKey: true, 
     autoIncrement:true
   },
    book_id: {type:DataTypes.INTEGER, 
        underscored: true
      
      },

    patron_id: {type:DataTypes.INTEGER,
        underscored: true
      },
    loaned_on: {type:DataTypes.DATEONLY,
      validate:{
        notEmpty:{
          msg:'The Loaned On Date was empty, Please follow the instructions'
        },
        isDate: {
          args:true,
          msg: 'This is not a date '
        },

        len:{
          args:[10,30],
          msg:'Please reformat the date'
        }

      }},
    return_by: {type: DataTypes.DATEONLY,
      validate:{
        notEmpty:{
          msg:'The Return By Date Was Empty, please follow the instructions'
        },
        isDate: {
          args:true,
          msg: 'This is not a date '
        },
         len:{
          args:[10,30],
          msg:'Please reformat the date'
        }
      }},
    returned_on: {

      type: DataTypes.DATEONLY,

      validate:{
        notEmpty:{
          msg:'The Return On Date Was Empty, please follow the format'
        },
        isDate: {
          args:true,
          msg: 'This is not a date '
        },
         len:{
          args:[10,30],
          msg:'Please reformat the date'
        }
      }
    }



  }, {timestamps: false});
  Loans.associate = function(models) {
    // associations can be defined here
   Loans.belongsTo(models.Books, {foreignKey: 'book_id' })
   Loans.belongsTo(models.Patrons, {foreignKey: 'patron_id' })

  };
  return Loans;
};