import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });
  const [editUser, setEditUser] = useState(null);
  const [errors, setErrors] = useState({ name: "", email: "", role: "" });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleAddUser = async () => {
    if (!validateUser(newUser)) return;
    try {
      const response = await axios.post("http://localhost:5000/users", newUser);
      setUsers([...users, response.data]);
      setNewUser({ name: "", email: "", role: "" });
      setErrors({ name: "", email: "", role: "" });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = async () => {
    if (!validateUser(newUser)) return;
    try {
      await axios.put(`http://localhost:5000/users/${editUser.id}`, newUser);
      const updatedUsers = users.map((user) =>
        user.id === editUser.id ? { ...user, ...newUser } : user
      );
      setUsers(updatedUsers);
      setNewUser({ name: "", email: "", role: "" });
      setEditUser(null);
      setErrors({ name: "", email: "", role: "" });
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const validateUser = (user) => {
    let valid = true;
    const newErrors = { name: "", email: "", role: "" };

    if (!user.name) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!user.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Email is not valid";
      valid = false;
    }
    if (!user.role) {
      newErrors.role = "Role is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  return (
    <div className="background-container">
      <h2>User Management</h2>

      {/* Add or Edit User Form */}
      <div className="form-container">
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="Enter Name"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Enter Email"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div>
          <label>Role:</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.role && <p className="error">{errors.role}</p>}
        </div>

        <div>
          <button
            onClick={editUser ? handleEditUser : handleAddUser}
            disabled={!(newUser.name && newUser.email && newUser.role)}
          >
            {editUser ? "Save Changes" : "Add User"}
          </button>
        </div>
      </div>

      {/* Users Table */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => setNewUser(user) && setEditUser(user)}
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;