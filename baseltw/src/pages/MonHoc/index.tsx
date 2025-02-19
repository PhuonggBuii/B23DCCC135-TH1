import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Select, Input, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./styles.css";
import { StudyRecord } from "@/services/MonHoc/typings";

const { Option } = Select;

const LOCAL_STORAGE_KEY = "studyRecords";

const Study: React.FC = () => {
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<StudyRecord | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [contentLearned, setContentLearned] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string | null>(null); 

  const subjects = ["Toán", "Văn", "Anh", "Công nghệ", "Hóa"];
  const timeSlots = ["07:00 - 09:00", "09:30 - 11:30", "13:00 - 15:00", "15:30 - 17:30", "19:00 - 21:00"];
  const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]; 

  useEffect(() => {
    const storedRecords = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const add = () => {
    if (!selectedSubject || !selectedTimeSlot || !contentLearned || !selectedDay) {
      message.error("Vui lòng điền đủ thông tin!");
      return;
    }

    if (editingRecord) {
      const updatedRecords = records.map((record) =>
        record.id === editingRecord.id
          ? { ...editingRecord, subject: selectedSubject, time: selectedTimeSlot, contentLearned, notes, day: selectedDay }
          : record
      );
      setRecords(updatedRecords);
      message.success("Môn học đã được cập nhật!");
    } else {
      const newRecord = {
        id: Date.now().toString(),
        subject: selectedSubject,
        time: selectedTimeSlot,
        contentLearned,
        notes,
        day: selectedDay,
      };
      setRecords([...records, newRecord]);
      message.success("Môn học đã được thêm!");
    }

    resetModal();
  };

  const deleteRecord = (id: string) => {
    const updatedRecords = records.filter((record) => record.id !== id);
    setRecords(updatedRecords);
    message.success("Môn học đã được xóa!");
  };

  const editRecord = (record: StudyRecord) => {
    setEditingRecord(record);
    setSelectedSubject(record.subject);
    setSelectedTimeSlot(record.time);
    setContentLearned(record.contentLearned);
    setNotes(record.notes);
    setSelectedDay(record.day); 
    setModalVisible(true);
  };

  const resetModal = () => {
    setSelectedSubject(null);
    setSelectedTimeSlot(null);
    setContentLearned("");
    setNotes("");
    setSelectedDay(null); 
    setEditingRecord(null);
    setModalVisible(false);
  };

  const columns = [
    {
      title: "Tên Môn Học",
      dataIndex: "subject",
      key: "subject",
      align: "center",
    },
    {
      title: "Khung Giờ Học",
      dataIndex: "time",
      key: "time",
      align: "center",
    },
    {
      title: "Ngày Học",
      dataIndex: "day",
      key: "day",
      align: "center",
    },
    {
      title: "Nội Dung Đã Học",
      dataIndex: "contentLearned",
      key: "contentLearned",
      align: "center",
    },
    {
      title: "Ghi Chú",
      dataIndex: "notes",
      key: "notes",
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_: any, record: StudyRecord) => (
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <Button type="default" onClick={() => editRecord(record)} icon={<EditOutlined />}>
            Sửa
          </Button>
          <Button type="primary" danger onClick={() => deleteRecord(record.id)} icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <h1 className="title">Quản lý Môn Học</h1>

      <div className="button-container">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Thêm Môn Học
        </Button>
      </div>

      <Table dataSource={records} columns={columns} rowKey="id" className="study-table" />

      <Modal
        title={editingRecord ? "Chỉnh Sửa Môn Học" : "Thêm Môn Học"}
        visible={modalVisible}
        onCancel={resetModal}
        onOk={add}
        okText={editingRecord ? "Cập Nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <div className="modal-content">
          <label>Chọn môn học:</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn môn học"
            value={selectedSubject}
            onChange={setSelectedSubject}
          >
            {subjects.map((subject) => (
              <Option key={subject} value={subject}>
                {subject}
              </Option>
            ))}
          </Select>

          <label>Chọn khung giờ học:</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn khung giờ"
            value={selectedTimeSlot}
            onChange={setSelectedTimeSlot}
          >
            {timeSlots.map((slot) => (
              <Option key={slot} value={slot}>
                {slot}
              </Option>
            ))}
          </Select>

          <label>Chọn ngày học:</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn ngày học"
            value={selectedDay}
            onChange={setSelectedDay}
          >
            {daysOfWeek.map((day) => (
              <Option key={day} value={day}>
                {day}
              </Option>
            ))}
          </Select>

          <label>Nội dung đã học:</label>
          <Input.TextArea
            value={contentLearned}
            onChange={(e) => setContentLearned(e.target.value)}
            placeholder="Mô tả nội dung đã học"
            rows={4}
          />

          <label>Ghi chú:</label>
          <Input.TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú"
            rows={2}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Study;