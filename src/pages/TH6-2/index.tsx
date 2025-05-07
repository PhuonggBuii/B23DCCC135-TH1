import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Tag, Space, message, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { StarOutlined, StarFilled, PushpinOutlined, PushpinFilled, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import moment from 'moment';  


const NoteManager: React.FC = () => {
    const [notes, setNotes] = useState<Note.Note[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note.Note | null>(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [filterTag, setFilterTag] = useState<string | null>(null);
    const [filterDate, setFilterDate] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
    useEffect(() => {
      const stored = localStorage.getItem('notes');
      if (stored) setNotes(JSON.parse(stored));
    }, []);
  
    const saveToStorage = (updatedNotes: Note.Note[]) => {
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    };
  
    const handleAdd = () => {
      setEditingNote(null);
      form.resetFields();
      setIsModalOpen(true);
    };
  
    const handleEdit = (note: Note.Note) => {
      setEditingNote(note);
      form.setFieldsValue(note);
      setIsModalOpen(true);
    };
  
    const handleDelete = (id: string) => {
      Modal.confirm({
        title: 'Bạn có chắc muốn xóa ghi chú này?',
        onOk: () => {
          const updated = notes.filter(n => n.id !== id);
          saveToStorage(updated);
          message.success('Đã xóa ghi chú');
        },
      });
    };
  
    const toggleImportant = (id: string) => {
      const updated = notes.map(n => n.id === id ? { ...n, important: !n.important } : n);
      saveToStorage(updated);
    };
  
    const togglePinned = (id: string) => {
      const updated = notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
      saveToStorage(updated);
    };
  
    const handleOk = () => {
      form.validateFields().then(values => {
        if (editingNote) {
          const updated = notes.map(n =>
            n.id === editingNote.id ? { ...n, ...values, createdAt: moment().format('DD/MM/YYYY') } : n
          );
          saveToStorage(updated);
          message.success('Đã cập nhật ghi chú');
        } else {
          const newNote: Note.Note = {
            id: Date.now().toString(),
            title: values.title,
            content: values.content,
            tag: values.tag,
            createdAt: moment().format('DD/MM/YYYY'),
            important: false,
            pinned: false,
          };
          saveToStorage([newNote, ...notes]);
          message.success('Đã thêm ghi chú');
        }
        setIsModalOpen(false);
      });
    };
  
    const filteredNotes = notes
      .filter(note => {
        const matchSearch =
          note.title.toLowerCase().includes(searchText.toLowerCase()) ||
          note.content.toLowerCase().includes(searchText.toLowerCase());
        const matchTag = filterTag ? note.tag.toLowerCase().includes(filterTag.toLowerCase()) : true;
        const matchDate = filterDate
          ? note.createdAt.toLowerCase().includes(filterDate.toLowerCase())
          : true;
        return matchSearch && matchTag && matchDate;
      })
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  
    const columns = [
      {
        title: 'Tiêu đề',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Nội dung',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center'
      },
      {
        title: 'Tag',
        dataIndex: 'tag',
        key: 'tag',
        render: (tag: string) => <Tag color="green">{tag}</Tag>,
        align: 'center',
      },
      {
        title: 'Hành động',
        align: 'center',
        key: 'action',
        render: (_: any, record: Note.Note) => (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
            <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
            <Button
              icon={record.important ? <StarFilled style={{ color: 'gold' }} /> : <StarOutlined />}
              onClick={() => toggleImportant(record.id)}
            />
            <Button
              icon={record.pinned ? <PushpinFilled style={{ color: 'red' }} /> : <PushpinOutlined />}
              onClick={() => togglePinned(record.id)}
            />
          </Space>
        ),
      },
    ];
  
    return (
      <div>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm ghi chú
          </Button>
          <Button
            icon={viewMode === 'list' ? <AppstoreOutlined /> : <BarsOutlined />}
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? 'Chuyển sang lưới' : 'Chuyển sang danh sách'}
          </Button>
        </Space>
  
        <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
          <Input
            placeholder="Tìm theo tiêu đề hoặc nội dung"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Input
            placeholder="Lọc theo Tag / Danh mục"
            value={filterTag || ''}
            onChange={e => setFilterTag(e.target.value || null)}
            style={{ width: 180 }}
          />
          <DatePicker
            placeholder="Lọc theo ngày"
            value={filterDate ? moment(filterDate, 'DD/MM/YYYY') : null}
            onChange={date => setFilterDate(date ? date.format('DD/MM/YYYY') : null)}
            style={{ width: 180 }}
          />
          <Button onClick={() => {
            setSearchText('');
            setFilterTag(null);
            setFilterDate(null);
          }}>
            Xóa lọc
          </Button>
        </div>
  
        {viewMode === 'list' ? (
          <Table columns={columns} dataSource={filteredNotes} rowKey="id" 
            pagination={{
            pageSizeOptions: ['5', '10', '15'],
            showSizeChanger: true,
            defaultPageSize: 5,
          }} />
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {filteredNotes.map(note => (
              <div key={note.id} style={{
                width: 250,
                border: '1px solid #ddd',
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 12,
                boxShadow: note.important ? '0 0 10px gold' : '0 0 5px #ccc',
                position: 'relative'
              }}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <Tag color="green">{note.tag}</Tag>
                <div style={{ marginTop: 8, fontSize: 12 }}>Ngày tạo: {note.createdAt}</div>
                <Space style={{ marginTop: 8 }}>
                  <Button icon={<EditOutlined />} onClick={() => handleEdit(note)} />
                  <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(note.id)} />
                  <Button icon={note.important ? <StarFilled style={{ color: 'gold' }} /> : <StarOutlined />} onClick={() => toggleImportant(note.id)} />
                  <Button icon={note.pinned ? <PushpinFilled style={{ color: 'red' }} /> : <PushpinOutlined />} onClick={() => togglePinned(note.id)} />
                </Space>
              </div>
            ))}
          </div>
        )}
  
        <Modal
          destroyOnClose
          footer={false}
          title={editingNote ? 'Chỉnh sửa ghi chú' : 'Thêm ghi chú'}
          visible={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
        >
          <Form form={form} layout="vertical" onFinish={handleOk}>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="tag" label="Tag / Danh mục" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {editingNote ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };
  
  export default NoteManager;
