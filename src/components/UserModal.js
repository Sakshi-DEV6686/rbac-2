import React, { useState, useEffect } from 'react';
import {
  Modal, Box, TextField, Button, Typography, MenuItem,
} from '@mui/material';
import axios from 'axios';

const UserModal = ({ open, onClose, user, refreshUsers }) => {
  const [formData, setFormData] = useState({ name: '', email: '', role: '', status: '' });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/roles').then((response) => setRoles(response.data));
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({ name: '', email: '', role: '', status: 'Active' });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/users', {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });
      alert('User added successfully');
      fetchData(); // Reload data after adding
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save user. Check console for details.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 3,
        }}
      >
        <Typography variant="h6" marginBottom={2}>
          {user ? 'Edit User' : 'Add User'}
        </Typography>
        <TextField
          fullWidth
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          select
          name="role"
          label="Role"
          value={formData.role}
          onChange={handleInputChange}
          margin="normal"
        >
          {roles.map((role) => (
            <MenuItem key={role.id} value={role.name}>
              {role.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          select
          name="status"
          label="Status"
          value={formData.status}
          onChange={handleInputChange}
          margin="normal"
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default UserModal;