import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../db/config.js";
import { User } from "./userModel.js";

export const OTP = sequelize.define(
  "otp",
  {
    otpId: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    OTP: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'userId',
      },
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expiryTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "otps",
  }
);

// Define relationship with User
OTP.belongsTo(User, { foreignKey: "userId" });
User.hasMany(OTP, { foreignKey: "userId" });