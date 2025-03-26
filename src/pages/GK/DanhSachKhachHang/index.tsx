import { Button, Form, Input, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';

interface Customer {
  id: string;
  name: string;
  dob: string;
  address: string;
  phone: string;
  email: string;
}

const DanhSachKhachHang = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('customers') || '[]');
    setCustomers(storedData);
  }, []);

  const saveToLocalStorage = (data: Customer[]) => {
    localStorage.setItem('customers', JSON.stringify(data));
    setCustomers(data);
  };

  const handleSave = (values: Omit<Customer, 'id'>) => {
    let updatedCustomers;
    if (isEdit && editingCustomer) {
      updatedCustomers = customers.map((c) => (c.id === editingCustomer.id ? { ...editingCustomer, ...values } : c));
    } else {
      const newCustomer: Customer = { id: Date.now().toString(), ...values };
      updatedCustomers = [...customers, newCustomer];
    }

    saveToLocalStorage(updatedCustomers);
    setVisible(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    const updatedCustomers = customers.filter((c) => c.id !== id);
    saveToLocalStorage(updatedCustomers);
  };

  const columns = [
    { title: 'Mã KH', dataIndex: 'id', key: 'id' },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Ngày sinh', dataIndex: 'dob', key: 'dob' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Hành động',
      key: 'action',
      render: (record: Customer) => (
        <>
          <Button
            onClick={() => {
              setIsEdit(true);
              setEditingCustomer(record);
              form.setFieldsValue(record);
              setVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record.id)} style={{ marginLeft: 10 }}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type='primary'
        onClick={() => {
          setIsEdit(false);
          setEditingCustomer(null);
          form.resetFields();
          setVisible(true);
        }}
      >
        Thêm khách hàng
      </Button>
      <Table dataSource={customers} columns={columns} rowKey='id' />

      <Modal
        destroyOnClose
        footer={false}
        title={isEdit ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng'}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout='vertical' onFinish={handleSave}>
          <Form.Item name='name' label='Tên' rules={[{ required: true, message: 'Vui lòng nhập Tên!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name='dob' label='Ngày sinh' rules={[{ required: true, message: 'Vui lòng nhập Ngày sinh!' }]}>
            <Input type='date' />
          </Form.Item>
          <Form.Item name='address' label='Địa chỉ' rules={[{ required: true, message: 'Vui lòng nhập Địa chỉ!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name='phone' label='Số điện thoại' rules={[{ required: true, message: 'Vui lòng nhập Số điện thoại!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name='email' label='Email' rules={[
            { required: true, message: 'Vui lòng nhập Email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}>
            <Input />
          </Form.Item>
          <Button type='primary' htmlType='submit'>{isEdit ? 'Cập nhật' : 'Thêm mới'}</Button>
          <Button onClick={() => setVisible(false)} style={{ marginLeft: 10 }}>Hủy</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default DanhSachKhachHang;
