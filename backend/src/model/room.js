module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    roomId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amanities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    bookingSlots: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  return Room;
};
