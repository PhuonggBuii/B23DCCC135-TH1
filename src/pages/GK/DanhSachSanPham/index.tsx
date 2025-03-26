import { Button, Form, Input, InputNumber, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const DanhSachSanPham = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedData);
  }, []);

  const saveToLocalStorage = (data: Product[]) => {
    localStorage.setItem('products', JSON.stringify(data));
    setProducts(data);
  };

  const handleSave = (values: Product) => {
    let updatedProducts;
    if (isEdit) {
      updatedProducts = products.map((p) => (p.id === editingProduct?.id ? { ...values, id: p.id } : p));
    } else {
      updatedProducts = [...products, { ...values, id: Date.now().toString() }];
    }

    saveToLocalStorage(updatedProducts);
    setVisible(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    saveToLocalStorage(updatedProducts);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search)
  );

  const columns = [
    { title: 'Mã sản phẩm', dataIndex: 'id', key: 'id' },
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (price: number) => `${price.toLocaleString()} VND` },
    { title: 'Số lượng trong kho', dataIndex: 'stock', key: 'stock' },
    {
      title: 'Hành động',
      key: 'action',
      render: (record: Product) => (
        <>
          <Button
            onClick={() => {
              setIsEdit(true);
              setEditingProduct(record);
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
      <Input placeholder="Tìm kiếm sản phẩm..." onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: 10 }} />
      <Button
        type='primary'
        onClick={() => {
          setIsEdit(false);
          setEditingProduct(null);
          form.resetFields();
          setVisible(true);
        }}
      >
        Thêm sản phẩm
      </Button>
      <Table dataSource={filteredProducts} columns={columns} rowKey='id' style={{ marginTop: 10 }} />

      <Modal
        destroyOnClose
        footer={false}
        title={isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout='vertical' onFinish={handleSave}>
          <Form.Item name='name' label='Tên sản phẩm' rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>            
            <Input />
          </Form.Item>
          <Form.Item name='price' label='Giá' rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>            
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name='stock' label='Số lượng trong kho' rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>            
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Button type='primary' htmlType='submit'>
            {isEdit ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button onClick={() => setVisible(false)} style={{ marginLeft: 10 }}>
            Hủy
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default DanhSachSanPham;