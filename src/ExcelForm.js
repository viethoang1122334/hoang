import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExcelForm = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    // Khi component mount, tải dữ liệu từ localStorage
    const savedData = localStorage.getItem('data');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  const handleNameChange = (e) => setName(e.target.value);
  const handleNumberChange = (e) => setNumber(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Cập nhật dữ liệu
    const newData = [...data, { Name: name, Number: number }];
    setData(newData);

    // Lưu dữ liệu vào localStorage
    localStorage.setItem('data', JSON.stringify(newData));

    // Tạo workbook và sheet
    const ws = XLSX.utils.json_to_sheet(newData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Chuyển đổi thành file và lưu
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'data.xlsx');

    // Xóa thông tin đã nhập
    setName('');
    setNumber('');
  };

  return (
    <div>
      <h1>Nhập thông tin và lưu vào Excel</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên:</label>
          <input type="text" value={name} onChange={handleNameChange} required />
        </div>
        <div>
          <label>Số:</label>
          <input type="number" value={number} onChange={handleNumberChange} required />
        </div>
        <button type="submit">Gửi và lưu vào Excel</button>
      </form>
    </div>
  );
};

export default ExcelForm;
