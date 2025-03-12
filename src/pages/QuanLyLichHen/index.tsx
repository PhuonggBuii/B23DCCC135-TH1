import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, DatePicker, Select, TimePicker, message, Table, Tag, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

interface Employee {
  id: number;
  name: string;
  maxAppointmentsPerDay: number;
  workDays: string[];
  workHours: [string, string];
}

interface Appointment {
  id: number;
  name: string;
  date: string;
  time: string;
  employeeId: number;
  status: string;
}

const QuanLyLichHen: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    setAppointments(JSON.parse(localStorage.getItem("appointments") || "[]"));
    setEmployees(JSON.parse(localStorage.getItem("employees") || "[]"));
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    const selectedEmployee = employees.find(emp => emp.id === values.employee);
    if (!selectedEmployee) return;

    const newAppointment: Appointment = {
      id: new Date().getTime(),
      name: values.name,
      date: values.date.format("YYYY-MM-DD"),
      time: values.time.format("HH:mm"),
      employeeId: values.employee,
      status: "Chờ duyệt",
    };

    const dayMap: Record<string, string> = {
        Monday: "Thứ 2",
        Tuesday: "Thứ 3",
        Wednesday: "Thứ 4",
        Thursday: "Thứ 5",
        Friday: "Thứ 6",
        Saturday: "Thứ 7",
        Sunday: "Chủ Nhật",
      };
      
      const dayOfWeek = dayMap[dayjs(values.date).format("dddd")];
      
      if (!selectedEmployee.workDays.includes(dayOfWeek)) {
        message.error(`Nhân viên ${selectedEmployee.name} không làm việc vào ${dayOfWeek}`);
        return;
      }

    const [startHour, endHour] = selectedEmployee.workHours;
    if (newAppointment.time < startHour || newAppointment.time > endHour) {
      message.error(`Vui lòng chọn giờ trong khoảng ${startHour} - ${endHour}`);
      return;
    }

    const isDuplicate = appointments.some(appt =>
      appt.date === newAppointment.date && appt.time === newAppointment.time
    );
    if (isDuplicate) {
      message.error("Lịch hẹn vào thời gian này đã có, vui lòng chọn thời gian khác!");
      return;
    }

    const appointmentsOfTheDay = appointments.filter(
      appt => appt.date === newAppointment.date && appt.employeeId === newAppointment.employeeId
    );
    if (appointmentsOfTheDay.length >= selectedEmployee.maxAppointmentsPerDay) {
      message.error(`Nhân viên ${selectedEmployee.name} đã đạt giới hạn số khách/ngày!`);
      return;
    }

    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

    message.success("Đặt lịch thành công!");
    setVisible(false);
    form.resetFields();
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    const updatedAppointments = appointments.map(appt =>
      appt.id === id ? { ...appt, status: newStatus } : appt
    );

    setAppointments(updatedAppointments);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    message.success("Cập nhật trạng thái thành công!");
  };

  const handleDelete = (id: number) => {
    const updatedAppointments = appointments.filter(appt => appt.id !== id);
    setAppointments(updatedAppointments);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    message.success("Xóa lịch hẹn thành công!");
  };

  const columns = [
    { title: "Họ và Tên", dataIndex: "name", key: "name" },
    { title: "Ngày hẹn", dataIndex: "date", key: "date" },
    { title: "Giờ hẹn", dataIndex: "time", key: "time" },
    {
      title: "Nhân viên",
      dataIndex: "employeeId",
      key: "employeeId",
      render: (employeeId: number) => employees.find(emp => emp.id === employeeId)?.name || "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "Chờ duyệt" ? "blue" : status === "Xác nhận" ? "green" : status === "Hoàn thành" ? "gold" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Appointment) => (
        <>
          <Select defaultValue={record.status} style={{ width: 120, marginRight: 8 }} onChange={value => handleStatusChange(record.id, value)}>
            <Option value="Chờ duyệt">Chờ duyệt</Option>
            <Option value="Xác nhận">Xác nhận</Option>
            <Option value="Hoàn thành">Hoàn thành</Option>
            <Option value="Hủy">Hủy</Option>
          </Select>
          <Popconfirm title="Bạn có chắc chắn muốn xóa lịch hẹn này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={showModal}>Đặt lịch hẹn</Button>
      <Table columns={columns} dataSource={appointments} rowKey="id" style={{ marginTop: 20 }} />

      <Modal destroyOnClose footer={false} title="Đặt lịch hẹn" visible={visible} onCancel={handleCancel}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Họ và Tên" rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}>
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item name="date" label="Ngày hẹn" rules={[{ required: true, message: "Chọn ngày hẹn!" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="time" label="Giờ hẹn" rules={[{ required: true, message: "Chọn giờ hẹn!" }]}>
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>

          <Form.Item name="employee" label="Nhân viên phục vụ" rules={[{ required: true, message: "Chọn nhân viên!" }]}>
            <Select placeholder="Chọn nhân viên">
              {employees.map(emp => (
                <Option key={emp.id} value={emp.id}>{emp.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>Xác nhận</Button>
            <Button onClick={handleCancel}>Hủy</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default QuanLyLichHen;