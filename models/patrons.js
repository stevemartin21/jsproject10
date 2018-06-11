'use strict';
module.exports = (sequelize, DataTypes) => {
  var Patrons = sequelize.define('Patrons', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    first_name: {type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'First Name needs to be filled out'
        },
        len: {
          args: [2,100],
          msg: "Your First Name  is too long or short"
        }
      }},
    last_name: {type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'Last Name needs to be filled out'
        },
         len: {
          args: [2,100],
          msg: "Your  Last Name  is too long or short"
        }
      }},
    address: {type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'Address needs to be filled out'
        },
         len: {
          args: [2,100],
          msg: "Your Address  is too long or short"
        }
      }},
    email: {type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'Email needs to be filled out'
        },
        isEmail: {
          msg:'Yo put in an email will ya'
        }
      }},
    library_id: {type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'Library Id needs to be filled out'
        },
         len: {
          args: [2,100],
          msg: "Your Library Id  is too long or short"
        }
      }},
    zip_code: {type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'Zip Code needs to be filled out'
        },
         len: {
          args: [2,100],
          msg: "Your Zip Code  is too long or short"
        }
      }}
  }, {timestamps: false});
  Patrons.associate = function(models) {
    // associations can be defined here
    Patrons.hasMany(models.Loans, {foreignKey: 'patron_id'})
    
  };
  return Patrons;
};