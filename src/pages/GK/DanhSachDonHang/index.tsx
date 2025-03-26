import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Order {
  id: string;
  customerId: string;
  orderDate: string;
  total: number;
  status: string;
  products: Product[];
}

interface Customer {
  id: string;
  name: string;
}

const orderStatuses = ["Chờ xác nhận", "Đang giao", "Hoàn thành", "Hủy"];

const DanhSachDonHang: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [form] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const storedCustomers = JSON.parse(localStorage.getItem("customers") || "[]");
    setOrders(storedOrders);
    setProducts(storedProducts);
    setCustomers(storedCustomers);
  }, []);

  const saveToLocalStorage = (data: Order[]) => {
    localStorage.setItem("orders", JSON.stringify(data));
    setOrders(data);
  };

  const handleSave = (values: any) => {
    const selectedProducts = products.filter((p) => values.products.includes(p.id));
    const totalAmount = selectedProducts.reduce((sum, p) => sum + p.price, 0);
    let updatedOrders;
    if (isEdit && editingOrder) {
      updatedOrders = orders.map((o) =>
        o.id === editingOrder.id ? { ...values, id: o.id, total: totalAmount, products: selectedProducts } : o
      );
    } else {
      const newOrder: Order = { 
        id: Date.now().toString(), 
        ...values, 
        total: totalAmount, 
        products: selectedProducts,
        status: "Chờ xác nhận"
      };
      updatedOrders = [...orders, newOrder];
    }
    try {
        saveToLocalStorage(updatedOrders);
        setVisible(false);
        form.resetFields();
        message.success(isEdit ? "Cập nhật đơn hàng thành công!" : "Thêm đơn hàng thành công!");
      } catch (error) {
        message.error("Đã có lỗi xảy ra, vui lòng thử lại!");
      }      
  };

  const handleDelete = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (order?.status === "Chờ xác nhận") {
      const updatedOrders = orders.filter((o) => o.id !== id);
      try {
        saveToLocalStorage(updatedOrders);
        message.success("Đã hủy đơn hàng thành công!");
      } catch (error) {
        message.error("Chỉ có thể hủy đơn hàng ở trạng thái 'Chờ xác nhận'");
      }
    } else {
      message.warning("Chỉ có thể hủy đơn hàng ở trạng thái 'Chờ xác nhận'");
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    const updatedOrders = orders.map((o) => o.id === id ? { ...o, status } : o);
    saveToLocalStorage(updatedOrders);
  };

  const filteredOrders = orders.filter(o => 
    (!filterStatus || o.status === filterStatus) &&
    (o.id.includes(searchQuery) || customers.find(c => c.id === o.customerId)?.name.includes(searchQuery))
  );
  

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortKey === "orderDate") {
      return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
    } else if (sortKey === "total") {
      return a.total - b.total;
    }
    return 0;
  });

  return (
    <div>
        <Button type="primary" onClick={() => setVisible(true)}>
            Thêm đơn hàng
        </Button>
        <Input 
            placeholder="Tìm kiếm theo mã đơn hoặc khách hàng"
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginLeft: 10, width: 300 }}
        />
        <Select placeholder="Lọc theo trạng thái" onChange={setFilterStatus} allowClear style={{ marginLeft: 10 }}>
            {orderStatuses.map(status => <Select.Option key={status} value={status}>{status}</Select.Option>)}
        </Select>
        <Select placeholder="Sắp xếp theo" onChange={setSortKey} allowClear style={{ marginLeft: 10 }}>
            <Select.Option value="orderDate">Ngày đặt hàng</Select.Option>
            <Select.Option value="total">Tổng tiền</Select.Option>
        </Select>
        <Table
            dataSource={sortedOrders.map((o) => ({ ...o, customerName: customers.find((c) => c.id === o.customerId)?.name || "Unknown" }))}
            rowKey="id"
            columns={[
            { title: "Mã đơn", dataIndex: "id", key: "id", align:'center' },
            { title: "Khách hàng", dataIndex: "customerName", key: "customerName",align:'center' },
            { title: "Ngày đặt", dataIndex: "orderDate", key: "orderDate",align:'center' },
            { title: "Tổng tiền", dataIndex: "total", key: "total",align:'center' },
            { 
                title: "Trạng thái", 
                dataIndex: "status", 
                key: "status",
                render: (text, record: Order) => (
                <Select value={text} onChange={(value) => handleStatusChange(record.id, value)}>
                    {orderStatuses.map((s) => (
                    <Select.Option key={s} value={s}>{s}</Select.Option>
                    ))}
                </Select>
                )
            },
            {
                title: "Hành động",
                key: "action",
                render: (record: Order) => (
                <>
                    <Button onClick={() => { setIsEdit(true); setEditingOrder(record); form.setFieldsValue(record); setVisible(true); }}>Sửa</Button>
                    <Button danger onClick={() => handleDelete(record.id)} style={{ marginLeft: 10 }}>Hủy</Button>
                </>
                ),
            },
            ]}
        />
        <Modal
            destroyOnClose
            footer={false}
            title={isEdit ? "Chỉnh sửa đơn hàng" : "Thêm đơn hàng"}
            visible={visible}
            onCancel={() => { setVisible(false); form.resetFields(); }}
        >
            <Form form={form} layout="vertical" onFinish={handleSave} onFinishFailed={() => message.error("Vui lòng nhập đầy đủ thông tin!")}>
            <Form.Item name="customerId" label="Khách hàng" rules={[{ required: true, message: "Vui lòng chọn khách hàng!" }]}> 
                <Select>{customers.map((c) => (<Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>))}</Select>
            </Form.Item>
            <Form.Item name="products" label="Sản phẩm" rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}> 
                <Select mode="multiple">{products.map((p) => (<Select.Option key={p.id} value={p.id}>{p.name} - {p.price}đ</Select.Option>))}</Select>
            </Form.Item>
            <Form.Item name="orderDate" label="Ngày đặt" rules={[{ required: true, message: "Vui lòng chọn ngày đặt!" }]}> 
                <Input type="date" />
            </Form.Item>
            <Button type="primary" htmlType="submit">{isEdit ? "Cập nhật" : "Thêm mới"}</Button>
            <Button onClick={() => setVisible(false)} style={{ marginLeft: 10 }}>Hủy</Button>
            </Form>
        </Modal>
    </div>
  );
};

export default DanhSachDonHang;