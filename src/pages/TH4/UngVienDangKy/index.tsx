import React from "react";
import { Form, Input, Button, Select, message, Card } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const UngVienDangKy: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const existingData = JSON.parse(localStorage.getItem("dangKyList") || "[]");
    const newData = [...existingData, { id: Date.now().toString(),...values, trangThai: "Pending" }];
    localStorage.setItem("dangKyList", JSON.stringify(newData));
    message.success("Đăng ký thành công!");
    form.resetFields();
  };

  return (
    <Card title="Form Đăng Ký" style={{ maxWidth: 600, margin: "0 auto" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Họ tên"
          name="hoTen"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Nguyện vọng"
          name="nguyenVong"
          rules={[{ required: true, message: "Vui lòng chọn nguyện vọng" }]}
        >
          <Select placeholder="Chọn nguyện vọng">
            <Option value="Chủ công">Chủ công</Option>
            <Option value="Chuyền hai">Chuyền hai</Option>
            <Option value="Libero">Libero</Option>
            <Option value="Media">Media</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Lý do đăng ký"
          name="lyDo"
          rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
        >
          <TextArea rows={4} placeholder="Nhập lý do đăng ký" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Gửi đăng ký
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UngVienDangKy;
