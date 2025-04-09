import React, { useEffect, useState } from "react";
import { Table, Button, Input, Select, Space, message } from "antd";
import { ColumnsType } from "antd/es/table";
import * as XLSX from "xlsx";

const { Search } = Input;

interface ThanhVien {
  id: string;
  hoTen: string;
  email: string;
  vaiTro: string;
  nhom: "Team Spiker" | "Team Setter" | "Team Libero" | "Team Media";
}

const getTeamFromNguyenVong = (nguyenVong: string): ThanhVien["nhom"] => {
  switch (nguyenVong) {
    case "Chủ công": return "Team Spiker";
    case "Chuyền hai": return "Team Setter";
    case "Libero": return "Team Libero";
    case "Media": return "Team Media";
    default: return "Team Media";
  }
};

const getNguyenVongFromTeam = (team: ThanhVien["nhom"]): string => {
  switch (team) {
    case "Team Spiker": return "Chủ công";
    case "Team Setter": return "Chuyền hai";
    case "Team Libero": return "Libero";
    case "Team Media": return "Media";
    default: return "Media";
  }
};

const QuanLyThanhVien: React.FC = () => {
  const [thanhVienList, setThanhVienList] = useState<ThanhVien[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("dangKyList") || "[]");
    const approved = data.filter((uv: any) => uv.trangThai === "Approved");
    const members: ThanhVien[] = approved.map((uv: any) => ({
      id: uv.id,
      hoTen: uv.hoTen,
      email: uv.email,
      vaiTro: "Member",
      nhom: getTeamFromNguyenVong(uv.nguyenVong),
    }));
    setThanhVienList(members);
  }, []);

  const handleGroupChange = (value: ThanhVien["nhom"], id: string) => {
    const updatedList = thanhVienList.map((tv) =>
      tv.id === id ? { ...tv, nhom: value } : tv
    );
    setThanhVienList(updatedList);

    const updatedData = JSON.parse(localStorage.getItem("dangKyList") || "[]").map((uv: any) =>
      uv.id === id ? { ...uv, nguyenVong: getNguyenVongFromTeam(value) } : uv
    );
    localStorage.setItem("dangKyList", JSON.stringify(updatedData));
    message.success("Cập nhật nhóm thành công!");
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ThanhVien");
    XLSX.writeFile(wb, "DanhSachThanhVien.xlsx");
  };

  const filteredList = thanhVienList.filter((tv) =>
    tv.hoTen.toLowerCase().includes(search.toLowerCase()) ||
    tv.email.toLowerCase().includes(search.toLowerCase()) ||
    tv.nhom.toLowerCase().includes(search.toLowerCase())
  );

  const columns: ColumnsType<ThanhVien> = [
    {
      title: "Họ tên",
      dataIndex: "hoTen",
      sorter: (a, b) => a.hoTen.localeCompare(b.hoTen),
      defaultSortOrder: "ascend",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "vaiTro",
      align: "center",
    },
    {
      title: "Nhóm",
      dataIndex: "nhom",
      align: "center",
      filters: [
        { text: "Team Spiker", value: "Team Spiker" },
        { text: "Team Setter", value: "Team Setter" },
        { text: "Team Libero", value: "Team Libero" },
        { text: "Team Media", value: "Team Media" },
      ],
      onFilter: (value, record) => record.nhom === value,
      render: (value: string, record: ThanhVien) => (
        <Select
          value={value}
          onChange={(newValue) =>
            handleGroupChange(newValue as ThanhVien["nhom"], record.id)
          }
          style={{ width: 180 }}
        >
          <Select.Option value="Team Spiker">Team Spiker</Select.Option>
          <Select.Option value="Team Setter">Team Setter</Select.Option>
          <Select.Option value="Team Libero">Team Libero</Select.Option>
          <Select.Option value="Team Media">Team Media</Select.Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Search
          placeholder="Tìm theo tên, email, nhóm..."
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 400 }}
        />
        <Button type="primary" onClick={exportToExcel}>
          Xuất Excel
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredList}
        rowKey="id"
        pagination={{
          pageSizeOptions: ["5", "10", "15"],
          showSizeChanger: true,
          defaultPageSize: 5,
        }}
      />
    </div>
  );
};

export default QuanLyThanhVien;
