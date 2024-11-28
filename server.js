const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Kết nối tới MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // thay bằng user MySQL của bạn
  password: '',  // thay bằng password của bạn
  database: 'phone_db'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// API: Lấy danh sách điện thoại
app.get('/phones', (req, res) => {
  const sql = 'SELECT * FROM phones';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// API: Thêm điện thoại
app.post('/phones', (req, res) => {
    console.log(req.body); // Kiểm tra dữ liệu gửi lên từ frontend
    const { NAME, brand, price } = req.body;
    const sql = 'INSERT INTO phones (NAME, brand, price) VALUES (?, ?, ?)';

    db.query(sql, [NAME, brand, price], (err, result) => {
      if (err) throw err;
      res.send('Phone added successfully');
    });
  });

  const addPhone = async () => {
    console.log(newPhone); // Kiểm tra giá trị newPhone trước khi gửi
    await axios.post('http://localhost:5000/phones', newPhone);
    fetchPhones();
    closeModal();
  };
  
  
// API: Sửa thông tin điện thoại
app.put('/phones/:id', (req, res) => {
    const { id } = req.params;
    const { NAME, brand, price } = req.body;  // Đảm bảo nhận được đúng dữ liệu
    console.log('Received update data:', req.body);  // Log để kiểm tra dữ liệu
  
    const sql = 'UPDATE phones SET NAME = ?, brand = ?, price = ? WHERE id = ?';
    db.query(sql, [NAME, brand, price, id], (err, result) => {
      if (err) throw err;
      res.send('Phone updated successfully');
    });
  });
  

// API: Xóa điện thoại
app.delete('/phones/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM phones WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send('Phone deleted successfully');
  });
});

// Khởi động server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
