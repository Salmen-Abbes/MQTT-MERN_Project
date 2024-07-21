import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const AdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    console.log("admin", admin);
    if (!admin) {
      navigate('/');
    } else {
      axios.get('http://localhost:8000/api/users')
        .then(res => {
            setUsers(res.data.users)
        })
        .catch(err => console.log(err));
    }
  }, [navigate]);

  const handleAccessChange = (id, newAccess) => {
    const updatedUsers = users.map(user => {    
      if (user.id === id) {
        return { ...user, access: newAccess.join(',') };
      }
      return user;
    });
    setUsers(updatedUsers);
    axios.post(`http://localhost:8000/api/update-permissions/${id}`,{ token: localStorage.getItem('token')}, { permissions: newAccess.join(',')})
      .catch(err => console.log(err));
  };

  const handleSwitchChange = (id, type, checked) => {
    const user = users.find(user => user.id === id);
    let newAccess = user.access ? user.access.split(',') : [];
    if (checked) {
      newAccess.push(type);
    } else {
      newAccess = newAccess.filter(access => access !== type);
    }
    handleAccessChange(id, newAccess);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Temperature</TableCell>
              <TableCell align="right">Humidity</TableCell>
              <TableCell align="right">Pressure</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="right">
                  <Switch
                    checked={user.access.includes('T')}
                    onChange={e => handleSwitchChange(user.id, 'T', e.target.checked)}
                  />
                </TableCell>
                <TableCell align="right">
                  <Switch
                    checked={user.access.includes('H')}
                    onChange={e => handleSwitchChange(user.id, 'H', e.target.checked)}
                  />
                </TableCell>
                <TableCell align="right">
                  <Switch
                    checked={user.access.includes('P')}
                    onChange={e => handleSwitchChange(user.id, 'P', e.target.checked)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
    </div>
  );
};

export default AdminPage;
