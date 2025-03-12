import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, DatePicker, Select, TimePicker, message, Table, Tag, Popconfirm, Rate } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
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

interface Appointment {
    id: number;
    name: string;
    date: string;
    time: string;
    employeeId: number;
    service: string;
    status: string;
    rating?: number;
    feedback?: string;
}

const QuanLyLichHen: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [form] = Form.useForm();
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [ratingModalVisible, setRatingModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [feedbackForm] = Form.useForm();

    const handleServiceChange = (value: string) => {
        setFilteredEmployees(employees.filter(emp => emp.services.includes(value)));
        form.setFieldsValue({ employee: undefined });
    };

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
            service: values.service,
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

        if (newStatus === "Hoàn thành") {
            const appointment = updatedAppointments.find(appt => appt.id === id);
            if (appointment) {
                const existingFeedback = appointments.find(appt => appt.id === id)?.rating;

                if (!existingFeedback) {
                    setSelectedAppointment(appointment);
                    setRatingModalVisible(true);
                }
            }
        }

        message.success("Cập nhật trạng thái thành công!");
    };

    const handleDelete = (id: number) => {
        const updatedAppointments = appointments.filter(appt => appt.id !== id);
        setAppointments(updatedAppointments);
        localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
        message.success("Xóa lịch hẹn thành công!");
    };

    const handleRatingSubmit = (values: any) => {
        if (selectedAppointment) {
            const updatedAppointments = appointments.map(appt =>
                appt.id === selectedAppointment.id ? { ...appt, rating: values.rating, feedback: values.feedback } : appt
            );
            setAppointments(updatedAppointments);
            localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

            const newFeedback = {
                id: selectedAppointment.id,
                name: selectedAppointment.name,
                date: selectedAppointment.date,
                service: selectedAppointment.service,
                rating: values.rating,
                feedback: values.feedback,
            };

            const storedFeedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
            const updatedFeedbacks = [...storedFeedbacks, newFeedback];
            localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks));

            message.success("Đánh giá thành công!");
            setRatingModalVisible(false);
        }
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
            title: "Dịch vụ",
            dataIndex: "service",
            key: "service",
            render: (service: string) => service || "N/A",
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

                    <Form.Item name="service" label="Dịch vụ" rules={[{ required: true, message: "Chọn dịch vụ!" }]}>
                        <Select placeholder="Chọn dịch vụ" onChange={handleServiceChange}>
                            {Array.from(new Set(employees.flatMap(emp => emp.services))).map(service => (
                                <Option key={service} value={service}>{service}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="employee" label="Nhân viên phục vụ" rules={[{ required: true, message: "Chọn nhân viên!" }]}>
                        <Select placeholder="Chọn nhân viên" disabled={!filteredEmployees.length}>
                            {filteredEmployees.map(emp => (
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

            <Modal
                visible={ratingModalVisible}
                title="Đánh giá dịch vụ"
                onCancel={() => setRatingModalVisible(false)}
                footer={null}
            >
                <Form form={feedbackForm} layout="vertical" onFinish={handleRatingSubmit}>
                    <Form.Item name="rating" label="Đánh giá sao" rules={[{ required: true, message: "Vui lòng đánh giá sao!" }]}>
                        <Rate />
                    </Form.Item>

                    <Form.Item name="feedback" label="Phản hồi">
                        <Input.TextArea rows={4} placeholder="Nhập phản hồi của bạn" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Gửi đánh giá</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default QuanLyLichHen;