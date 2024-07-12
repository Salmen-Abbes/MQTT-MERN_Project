const { updateAccess,getAllUsers,UserDelete } = require('../models/userModel');

const fetchUsers = async (req, res) => {
  const users = await getAllUsers();
  res.json({ users });
};

const changeUserProps = async (req, res) => {
  const user  = req.body;
  await updateAccess(user)
  res.json({ message: 'User Access Updated' });
};

const deleteUser = async (req,res)=>{
  const { id } = req.params;
  console.log(id)
  await UserDelete(id);
  res.json({message:'User Deleted Successfuly'})
}
module.exports = {
  fetchUsers,
  changeUserProps,
  deleteUser
};
