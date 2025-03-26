import React, { useState, useEffect } from "react";
import { Table, Select, DatePicker, Typography } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { ConfigProvider } from "antd";
import dayjsGenerateConfig from "rc-picker/es/generate/dayjs";

ConfigProvider.config({
  locale: "vi",
  generateConfig: dayjsGenerateConfig,
});

const { Option } = Select;
const { Title } = Typography;

interface Appointment {
  id: number;
  date: string;
  service: string;
  employeeId: number;
  status: string;
}

interface Employee {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
}

const ThongKe: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filterType, setFilterType] = useState("day");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  
  useEffect(() => {
    setAppointments(JSON.parse(localStorage.getItem("appointments") || "[]"));
    setEmployees(JSON.parse(localStorage.getItem("employees") || "[]"));
    setServices(JSON.parse(localStorage.getItem("services") || "[]"));
  }, []);

  const filteredAppointments = appointments.filter(appt => {
    const appointmentDate = dayjs(appt.date);
    return appt.status === "Hoàn thành" && (filterType === "day" ? appointmentDate.isSame(selectedDate, "day") : appointmentDate.isSame(selectedDate, "month"));
  });

  const revenueByService: Record<string, number> = {};
  const revenueByEmployee: Record<number, number> = {};
  let totalRevenue = 0;

  filteredAppointments.forEach(appt => {
    const service = services.find(service => service.name === appt.service);
    const revenue = service ? service.price : 0;
    
    revenueByService[appt.service] = (revenueByService[appt.service] || 0) + revenue;
    revenueByEmployee[appt.employeeId] = (revenueByEmployee[appt.employeeId] || 0) + revenue;
    totalRevenue += revenue;
  });

  const revenueByServiceData = Object.entries(revenueByService).map(([serviceName, revenue]) => ({
    service: serviceName,
    revenue,
  }));

  const revenueByEmployeeData = Object.entries(revenueByEmployee).map(([id, revenue]) => ({
    employee: employees.find(emp => emp.id === Number(id))?.name || "N/A",
    revenue,
  }));

  return (
    <div>
      <Title level={3}>Thống kê & Báo cáo</Title>
      <Select value={filterType} onChange={setFilterType} style={{ width: 150, marginRight: 10 }}>
        <Option value="day">Theo ngày</Option>
        <Option value="month">Theo tháng</Option>
      </Select>
      <DatePicker
        picker={filterType === "day" ? "date" : "month"}
        value={selectedDate}
        onChange={setSelectedDate}
      />

      <Title level={4} style={{ marginTop: 20 }}>Doanh thu theo dịch vụ</Title>
      <Table dataSource={revenueByServiceData} rowKey="service" pagination={false} bordered>
        <Table.Column title="Dịch vụ" dataIndex="service" key="service" />
        <Table.Column title="Doanh thu (VND)" dataIndex="revenue" key="revenue" render={revenue => revenue.toLocaleString()} />
      </Table>

      <Title level={4} style={{ marginTop: 20 }}>Doanh thu theo nhân viên</Title>
      <Table dataSource={revenueByEmployeeData} rowKey="employee" pagination={false} bordered>
        <Table.Column title="Nhân viên" dataIndex="employee" key="employee" />
        <Table.Column title="Doanh thu (VND)" dataIndex="revenue" key="revenue" render={revenue => revenue.toLocaleString()} />
      </Table>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, alignItems: "center" }}>
        <Title level={2} style={{ color: "black", margin: 0 }}>Tổng doanh thu:</Title>
        <Title level={2} style={{ color: "#2e7d32", margin: 0 }}>
            {totalRevenue.toLocaleString()} VND
        </Title>
    </div>
    </div>
  );
};

export default ThongKe;
