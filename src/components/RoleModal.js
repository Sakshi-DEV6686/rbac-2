import React, { useState } from "react";
import Modal from "react-modal";

function RoleModal({ isOpen, onRequestClose, role, onSave }) {
  const [newRole, setNewRole] = useState(role);

  const handleSave = () => {
    onSave(newRole);
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>Edit Role</h2>
      <input
        type="text"
        value={newRole}
        onChange={(e) => setNewRole(e.target.value)}
        placeholder="Edit role"
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
}

export default RoleModal;