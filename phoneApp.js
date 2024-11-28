import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PhoneApp.css';

const PhoneApp = () => {
  const [phones, setPhones] = useState([]);
  const [newPhone, setNewPhone] = useState({ NAME: '', brand: '', price: '' });
  const [editingPhone, setEditingPhone] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPhones();
  }, []);

  const fetchPhones = async () => {
    const res = await axios.get('http://localhost:5000/phones');
    setPhones(res.data);
  };

  const addPhone = async () => {
    await axios.post('http://localhost:5000/phones', newPhone);
    fetchPhones();
    closeModal();
  };

  const updatePhone = async (id) => {
    // Cập nhật dữ liệu từ newPhone thay vì editingPhone
    await axios.put(`http://localhost:5000/phones/${id}`, newPhone);
    fetchPhones();
    closeModal();
  };
  

  const deletePhone = async (id) => {
    await axios.delete(`http://localhost:5000/phones/${id}`);
    fetchPhones();
  };

  const openModal = (phone = null) => {
    if (phone) {
      setEditingPhone(phone);
      // Sao chép giá trị từ phone vào newPhone để có thể chỉnh sửa
      setNewPhone({ NAME: phone.NAME, brand: phone.brand, price: phone.price });
    } else {
      setNewPhone({ NAME: '', brand: '', price: '' });
    }
    setIsModalOpen(true);
  };
  

  const closeModal = () => {
    setEditingPhone(null);
    setNewPhone({ NAME: '', brand: '', price: '' });
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Phone CRUD App</h1>
      <div className="container">
        <button className="add-button" onClick={() => openModal()}>Add New Phone</button>

        <div>
          <h2>Phone List</h2>
          <ul className="phone-list">
            {phones.map(phone => (
              <li key={phone.id}>
                {phone.NAME} - {phone.brand} - {phone.price} USD
                <div>
                  <button className="edit-button" onClick={() => openModal(phone)}>Edit</button>
                  <button className="delete-button" onClick={() => deletePhone(phone.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={`modal ${isModalOpen ? 'show' : ''}`}>
          <div className="modal-content">
            <h2>{editingPhone ? 'Edit Phone' : 'Add New Phone'}</h2>
            <input
              type="text"
              placeholder="NAME"
              value={newPhone.NAME}
              onChange={(e) => setNewPhone({ ...newPhone, NAME: e.target.value })}
            />
            <input
              type="text"
              placeholder="Brand"
              value={newPhone.brand}
              onChange={(e) => setNewPhone({ ...newPhone, brand: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              value={newPhone.price}
              onChange={(e) => setNewPhone({ ...newPhone, price: e.target.value })}
            />
            <button
              className="add-button"
              onClick={() => editingPhone ? updatePhone(editingPhone.id) : addPhone()}
            >
              {editingPhone ? 'Update' : 'Add'}
            </button>
            <button className="close-modal" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneApp;
