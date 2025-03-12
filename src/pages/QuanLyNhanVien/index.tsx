import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form, Input, Select, TimePicker, InputNumber, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

interface Employee {
  id: number;
  name: string;
  maxAppointmentsPerDay: number;
  workDays: string[];
  workHours: [string, string];
  services: string[];
}

const QuanLyNhanVien: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm();
  const [servicesList, setServicesList] = useState<{ id: number; name: string; price: number }[]>([]);

  useEffect(() => {
    const savedEmployees = JSON.parse(localStorage.getItem("employees") || "[]");
    setEmployees(savedEmployees);
  }, []);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    // Lấy danh sách dịch vụ từ localStorage
    const savedServices = JSON.parse(localStorage.getItem("services") || "[]");
    setServicesList(savedServices);
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setIsEdit(false);
    setCurrentEmployee(null);
    form.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      const selectedServices = servicesList.filter(service => values.services.includes(service.name));
  
      const newEmployee: Employee = {
        id: isEdit && currentEmployee ? currentEmployee.id : Date.now(),
        name: values.name,
        maxAppointmentsPerDay: values.maxAppointmentsPerDay,
        workDays: values.workDays,
        workHours: [values.startHour.format("HH:mm"), values.endHour.format("HH:mm")],
        services: selectedServices.map(service => service.name), // Lưu danh sách dịch vụ theo tên
      };
  
      if (isEdit) {
        setEmployees(employees.map(emp => (emp.id === currentEmployee?.id ? newEmployee : emp)));
      } else {
        setEmployees([...employees, newEmployee]);
      }
  
      handleCancel();
    }).catch(info => console.log("Validation Failed:", info));
  };

  const handleDelete = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleEdit = (employee: Employee) => {
    setIsEdit(true);
    setCurrentEmployee(employee);
    form.setFieldsValue({
      name: employee.name,
      maxAppointmentsPerDay: employee.maxAppointmentsPerDay,
      workDays: employee.workDays,
      startHour: dayjs(employee.workHours[0], "HH:mm"),
      endHour: dayjs(employee.workHours[1], "HH:mm"),
      services: employee.services,
    });
    setVisible(true);
  };

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Thêm Nhân Viên
      </Button>

      <Table dataSource={employees} rowKey="id" style={{ marginTop: 20 }} bordered>
        <Table.Column title="Tên Nhân Viên" dataIndex="name" key="name" />
        <Table.Column title="Số khách tối đa/ngày" dataIndex="maxAppointmentsPerDay" key="maxAppointmentsPerDay" />
        <Table.Column title="Ngày làm việc" dataIndex="workDays" key="workDays" render={days => days.join(", ")} />
        <Table.Column title="Giờ làm việc" dataIndex="workHours" key="workHours" render={hours => `${hours[0]} - ${hours[1]}`} />
        <Table.Column title="Dịch vụ" dataIndex="services" key="services" render={services => services.join(", ")} />
        <Table.Column
          title="Hành động"
          key="actions"
          render={(_, record: Employee) => (
            <>
              <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                Sửa
              </Button>
              <Popconfirm title="Xóa nhân viên?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
                <Button type="link" danger icon={<DeleteOutlined />}>
                  Xóa
                </Button>
              </Popconfirm>
            </>
          )}
        />
      </Table>

      <Modal
        destroyOnClose
        footer={false}
        title={isEdit ? "Sửa Nhân Viên" : "Thêm Nhân Viên"}
        visible={visible}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên Nhân Viên" rules={[{ required: true, message: "Nhập tên nhân viên!" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="maxAppointmentsPerDay" label="Số khách tối đa/ngày" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="workDays" label="Ngày làm việc" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Chọn ngày làm việc">
              <Option value="Thứ 2">Thứ 2</Option>
              <Option value="Thứ 3">Thứ 3</Option>
              <Option value="Thứ 4">Thứ 4</Option>
              <Option value="Thứ 5">Thứ 5</Option>
              <Option value="Thứ 6">Thứ 6</Option>
              <Option value="Thứ 7">Thứ 7</Option>
              <Option value="Chủ Nhật">Chủ Nhật</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Giờ làm việc" style={{ marginBottom: 0 }}>
            <Form.Item name="startHour" style={{ display: "inline-block", width: "48%" }} rules={[{ required: true }]}>
              <TimePicker format="HH:mm" />
            </Form.Item>
            <span style={{ display: "inline-block", width: "4%", textAlign: "center" }}> - </span>
            <Form.Item name="endHour" style={{ display: "inline-block", width: "48%" }} rules={[{ required: true }]}>
              <TimePicker format="HH:mm" />
            </Form.Item>
          </Form.Item>

          <Form.Item name="services" label="Dịch vụ" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Chọn dịch vụ">
                {servicesList.map(service => (
                <Option key={service.id} value={service.name}>
                    {service.name} - {service.price.toLocaleString()} VND
                </Option>
                ))}
            </Select>
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

export default QuanLyNhanVien;
