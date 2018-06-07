'use strict';
module.exports = (sequelize, DataTypes) => {
  var Patrons = sequelize.define('Patrons', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    first_name: {type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'First Name needs to be filled out'
        }
      }},
    last_name: {type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'Last Name needs to be filled out'
        }
      }},
    address: {type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'Address needs to be filled out'
        }
      }},
    email: {type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'Email needs to be filled out'
        }
      }},
    library_id: {type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'Library Id needs to be filled out'
        }
      }},
    zip_code: {type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'Zip Code needs to be filled out'
        }
      }}
  }, {timestamps: false});
  Patrons.associate = function(models) {
    // associations can be defined here
    Patrons.hasMany(models.Loans, {foreignKey: 'patron_id'})
    
  };
  return Patrons;
};