const db = require('../config/db');

const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const UserDelete = async (id)=>{
  await db.query('DELETE FROM users WHERE id = ?', [id]);
}

const getAllUsers = async ()=>{
    const [rows] = await db.query('SELECT * FROM users');
    return rows
}

const createUser = async (user) => {
  const { name, email, password } = user;
  const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
  return result.insertId;
};

const findUserById = async (id) => {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  };
  
  const updateUser = async (user) => {
    const { id, name, email, password, resetPasswordToken } = user;
    await db.query('UPDATE users SET name = ?, email = ?, password = ?, resetPasswordToken = ? WHERE id = ?', [name, email, password, resetPasswordToken, id]);
  };
  const updateAccess = async (user)=>{
    const { id, access } = user;
  const accessString = JSON.stringify(access);
  await db.query('UPDATE users SET access = ? WHERE id = ?', [JSON.parse(accessString), id]);
  }

// Other user-related functions...

module.exports = {
  findUserByEmail,
  createUser,
  getAllUsers,
  findUserById,
  updateUser,
  updateAccess,
  UserDelete,
};
