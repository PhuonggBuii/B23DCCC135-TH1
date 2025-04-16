import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Rate,
  Space,
  message,
} from "antd";
import type { Destination } from "../../../services/KhamPhaDiemDen/typings";

const { Option } = Select;

const LOCAL_STORAGE_KEY = "destinations";

const DestinationAdmin: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Destination | null>(null);

  const [form] = Form.useForm();

  // Load dữ liệu từ localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setDestinations(JSON.parse(stored));
    }
  }, []);

  const saveToLocalStorage = (data: Destination[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  };

  const showAddModal = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (item: Destination) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    const updated = destinations.filter((d) => d.id !== id);
    setDestinations(updated);
    saveToLocalStorage(updated);
    message.success("Đã xóa điểm đến!");
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      let updatedData = [...destinations];
      if (editingItem) {
        // Sửa
        updatedData = updatedData.map((item) =>
          item.id === editingItem.id ? { ...editingItem, ...values } : item
        );
        message.success("Cập nhật thành công!");
      } else {
        // Thêm
        const newItem: Destination = {
          ...values,
          id: Date.now(),
        };
        updatedData.push(newItem);
        message.success("Thêm mới thành công!");
      }
      setDestinations(updatedData);
      saveToLocalStorage(updatedData);
      setIsModalVisible(false);
    });
  };

  const columns = [
    { title: "Tên", dataIndex: "name" },
    { title: "Địa điểm", dataIndex: "location" },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render: (url: string) => (
        <img src={url} alt="" style={{ width: 80, height: 60, objectFit: "cover" }} />
      ),
    },
    { title: "Giá", dataIndex: "price", render: (v: number) => `${v.toLocaleString()} VND` },
    { title: "Loại", dataIndex: "type" },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      render: (v: number) => <Rate disabled value={v} allowHalf />,
    },
    {
      title: "Hành động",
      render: (_: any, record: Destination) => (
        <Space>
          <Button onClick={() => showEditModal(record)}>Sửa</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý điểm đến</h2>
      <Button type="primary" onClick={showAddModal} style={{ marginBottom: 16 }}>
        Thêm điểm đến
      </Button>
      <Table
        rowKey="id"
        dataSource={destinations}
        columns={columns}
        bordered
      />

      <Modal
        title={editingItem ? "Sửa điểm đến" : "Thêm điểm đến"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Tên điểm đến"
            rules={[{ required: true, message: "Nhập tên điểm đến" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="Địa điểm"
            rules={[{ required: true, message: "Nhập địa điểm" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="URL hình ảnh"
            rules={[{ required: true, message: "Nhập URL hình ảnh" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Nhập giá" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại hình"
            rules={[{ required: true, message: "Chọn loại hình" }]}
          >
            <Select>
              <Option value="biển">Biển</Option>
              <Option value="núi">Núi</Option>
              <Option value="thành phố">Thành phố</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="rating"
            label="Đánh giá"
            rules={[{ required: true, message: "Nhập đánh giá" }]}
          >
            <InputNumber min={0} max={5} step={0.1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DestinationAdmin;