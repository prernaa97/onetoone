import { DataTypes } from "sequelize";
import sequelize from "../db.js";
 
const Profile=sequelize.define('Profile',{
    pid:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    bio:{
        type:DataTypes.STRING,
        allowNull:false
    },
    age:{
        type:DataTypes.INTEGER,
        allowNull:false

    }
},{
    timestamps:false
})

export default Profile;