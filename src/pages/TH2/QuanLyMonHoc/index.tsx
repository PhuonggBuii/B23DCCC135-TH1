import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Subject {
  id: number;
  code: string;
  name: string;
  credits: number;
  topics: string[];
}

const QuanLyMonHoc: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    setSubjects(storedSubjects);
  }, []);

  const saveToLocalStorage = (data: Subject[]) => {
    localStorage.setItem("subjects", JSON.stringify(data));
  };

  const openModal = (subject?: Subject) => {
    setIsEdit(!!subject);
    setEditingSubject(subject || null);
    setVisible(true);
    form.setFieldsValue(subject || { code: "", name: "", credits: 1, topics: [] });
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      let updatedSubjects;
      if (isEdit && editingSubject) {
        updatedSubjects = subjects.map((subject) =>
          subject.id === editingSubject.id ? { ...values, id: subject.id } : subject
        );
      } else {
        const newSubject: Subject = { ...values, id: Date.now() };
        updatedSubjects = [...subjects, newSubject];
      }
      setSubjects(updatedSubjects);
      saveToLocalStorage(updatedSubjects);
      setVisible(false);
      setEditingSubject(null);
      form.resetFields();
    });
  };

  const handleDelete = (id: number) => {
    const updatedSubjects = subjects.filter((subject) => subject.id !== id);
    setSubjects(updatedSubjects);
    saveToLocalStorage(updatedSubjects);
  };

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
        Thêm môn học
      </Button>

      <Table
        dataSource={subjects}
        rowKey="id"
        style={{ marginTop: 20 }}
        bordered
        columns={[
          { title: "Mã môn", dataIndex: "code", key: "code" },
          { title: "Tên môn", dataIndex: "name", key: "name" },
          { title: "Số tín chỉ", dataIndex: "credits", key: "credits" },
          {
            title: "Khối kiến thức",
            dataIndex: "topics",
            key: "topics",
            render: (topics: string[]) =>
              topics.map((topic, index) => <Tag color="blue" key={index}>{topic}</Tag>),
          },
          {
            title: "Hành động",
            key: "actions",
            render: (_, record: Subject) => (
              <>
                <Button
                  icon={<EditOutlined />}
                  type="primary"
                  onClick={() => openModal(record)}
                  style={{ marginRight: 8 }}
                />
                <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
              </>
            ),
          },
        ]}
      />

      <Modal
        destroyOnClose
        footer={false}
        title={isEdit ? "Chỉnh sửa môn học" : "Thêm môn học"}
        visible={visible}
        onOk={() => {}}
        onCancel={() => {
          setVisible(false);
          setEditingSubject(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          <Form.Item name="code" label="Mã môn" rules={[{ required: true, message: "Vui lòng nhập mã môn!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Tên môn" rules={[{ required: true, message: "Vui lòng nhập tên môn!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="credits" label="Số tín chỉ" rules={[{ required: true, type: "number", min: 1, message: "Nhập số tín chỉ hợp lệ!" }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="topics"
            label="Khối kiến thức"
            rules={[{ required: true, message: "Nhập các khối kiến thức, cách nhau bởi dấu phẩy!" }]}
            getValueFromEvent={(e) => e.target.value.split(",").map((item: string) => item.trim())}
          >
            <Input placeholder="Nhập danh sách khối kiến thức, ví dụ: Toán, Lý, Hóa" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEdit ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyMonHoc;