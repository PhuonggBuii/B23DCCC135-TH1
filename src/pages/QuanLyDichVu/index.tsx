import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form, Input, InputNumber, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface Service {
  id: number;
  name: string;
  price: number;
}

const QuanLyDichVu: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const savedServices = JSON.parse(localStorage.getItem("services") || "[]");
    setServices(savedServices);
  }, []);

  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setIsEdit(false);
    setCurrentService(null);
    form.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const newService: Service = {
        id: isEdit && currentService ? currentService.id : Date.now(),
        name: values.name,
        price: values.price,
      };

      if (isEdit) {
        setServices(services.map(service => (service.id === currentService?.id ? newService : service)));
      } else {
        setServices([...services, newService]);
      }

      handleCancel();
    });
  };

  const handleDelete = (id: number) => {
    setServices(services.filter(service => service.id !== id));
  };

  const handleEdit = (service: Service) => {
    setIsEdit(true);
    setCurrentService(service);
    form.setFieldsValue({
      name: service.name,
      price: service.price,
    });
    setVisible(true);
  };

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Thêm Dịch Vụ
      </Button>

      <Table dataSource={services} rowKey="id" style={{ marginTop: 20 }} bordered>
        <Table.Column title="Tên Dịch Vụ" dataIndex="name" key="name" />
        <Table.Column title="Giá Tiền" dataIndex="price" key="price" render={price => `${price.toLocaleString()} VNĐ`} />
        <Table.Column
          title="Hành động"
          key="actions"
          render={(_, record: Service) => (
            <>
              <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                Sửa
              </Button>
              <Popconfirm title="Xóa dịch vụ?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
                <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
              </Popconfirm>
            </>
          )}
        />
      </Table>

      <Modal destroyOnClose footer={false} title={isEdit ? "Sửa Dịch Vụ" : "Thêm Dịch Vụ"} visible={visible} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên Dịch Vụ" rules={[{ required: true, message: "Nhập tên dịch vụ!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Giá Tiền" rules={[{ required: true, message: "Nhập giá tiền!" }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSave} style={{ width: "100%" }}>
              {isEdit ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyDichVu;
