import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ name: "", permissions: "" });
  const [editRole, setEditRole] = useState(null); // To handle edit functionality
  const [errors, setErrors] = useState({ addRole: {} });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const validateRole = (roleData) => {
    const { name, permissions } = roleData;
    const validationErrors = {};

    if (!name) validationErrors.name = "Role name is required.";
    if (!permissions || permissions.trim() === "")
      validationErrors.permissions = "Permissions are required.";

    setErrors({ addRole: validationErrors });

    return Object.keys(validationErrors).length === 0;
  };

  const handleAddRole = async () => {
    if (!validateRole(newRole)) return;

    const permissionsArray = newRole.permissions
      .split(",")
      .map((permission) => permission.trim());

    try {
      const response = await axios.post("http://localhost:5000/roles", {
        ...newRole,
        permissions: permissionsArray,
      });
      setRoles([...roles, response.data]);
      setNewRole({ name: "", permissions: "" });
      setErrors({ addRole: {} });
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  const handleEditRole = async () => {
    if (!validateRole(newRole)) return;

    const permissionsArray = newRole.permissions
      .split(",")
      .map((permission) => permission.trim());

    try {
      await axios.put(`http://localhost:5000/roles/${editRole.id}`, {
        ...newRole,
        permissions: permissionsArray,
      });
      const updatedRoles = roles.map((role) =>
        role.id === editRole.id
          ? { ...role, ...newRole, permissions: permissionsArray }
          : role
      );
      setRoles(updatedRoles);
      setNewRole({ name: "", permissions: "" });
      setEditRole(null);
      setErrors({ addRole: {} });
    } catch (error) {
      console.error("Error editing role:", error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this role?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/roles/${roleId}`);
        const updatedRoles = roles.filter((role) => role.id !== roleId);
        setRoles(updatedRoles);
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }
  };

  const handleEditClick = (role) => {
    setEditRole(role);
    setNewRole({ name: role.name, permissions: role.permissions.join(", ") });
  };

  const handleCancelEdit = () => {
    setEditRole(null);
    setNewRole({ name: "", permissions: "" });
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Role Management
      </Typography>

      <Paper
        elevation={3}
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          padding: "20px",
        }}
      >
        <Typography variant="h6" align="center">
          {editRole ? "Edit Role" : "Add Role"}
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Role Name"
              value={newRole.name}
              onChange={(e) =>
                setNewRole({ ...newRole, name: e.target.value })
              }
              error={!!errors.addRole.name}
              helperText={errors.addRole.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Permissions (comma separated)"
              value={newRole.permissions}
              onChange={(e) =>
                setNewRole({ ...newRole, permissions: e.target.value })
              }
              error={!!errors.addRole.permissions}
              helperText={errors.addRole.permissions}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={editRole ? handleEditRole : handleAddRole}
            >
              {editRole ? "Save Changes" : "Add Role"}
            </Button>
            {editRole && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancelEdit}
                style={{ marginLeft: "8px" }}
              >
                Cancel
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Role Name</b></TableCell>
              <TableCell><b>Permissions</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.permissions.join(", ")}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditClick(role)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteRole(role.id)}
                    style={{ marginLeft: "8px" }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default RoleManagement;