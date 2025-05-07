import React, { useState, useEffect } from 'react';
import { Button, Layout, Typography, Input, Select, Row, Col, message, Form } from 'antd';
import TaskForm from '../components/TaskForm';
import TaskTable from '../components/TaskTable';
import TaskStatistics from '../components/TaskStatistics';
import '../styles/taskManager.css';

const { Header, Content } = Layout;
const { Text } = Typography;
const { Option } = Select;

const TaskManager = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [form] = Form.useForm();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filters, setFilters] = useState({ status: '', assignee: '', search: '' });
  const [hasLoaded, setHasLoaded] = useState(false); 

  useEffect(() => {
    try {
      const savedTasks = JSON.parse(localStorage.getItem(`tasks_${user.username}`)); // Sử dụng username làm key
      if (Array.isArray(savedTasks)) {
        setTasks(savedTasks);
      }
    } catch (error) {
      console.error('Lỗi khi đọc dữ liệu từ localStorage:', error);
    } finally {
      setHasLoaded(true); 
    }
  }, [user.username]); 

  useEffect(() => {
    if (!hasLoaded) return; 
    try {
      localStorage.setItem(`tasks_${user.username}`, JSON.stringify(tasks)); // 
      if (tasks.length > 0) {
        message.success('Dữ liệu đã được lưu vào trình duyệt!');
      }
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu vào localStorage:', error);
      message.error('Không thể lưu dữ liệu vào trình duyệt!');
    }
  }, [tasks, hasLoaded, user.username]); 

  useEffect(() => {
    let filtered = tasks;
    if (filters.status) filtered = filtered.filter(task => task.status === filters.status);
    if (filters.assignee) {
      filtered = filtered.filter(task => task.assignee.toLowerCase().includes(filters.assignee.toLowerCase()));
    }
    if (filters.search) {
      filtered = filtered.filter(task => task.name.toLowerCase().includes(filters.search.toLowerCase()));
    }
    setFilteredTasks(filtered);
  }, [tasks, filters]);

  const onFinish = (values) => {
    if (editingTaskId) {
      setTasks(prev =>
        prev.map(task => (task.id === editingTaskId ? { ...values, id: editingTaskId } : task))
      );
      message.success('Cập nhật công việc thành công!');
    } else {
      const newTask = { ...values, id: Date.now() };
      setTasks(prev => [...prev, newTask]);
      message.success('Thêm công việc mới thành công!');
    }
    form.resetFields();
    setEditingTaskId(null);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingTaskId(record.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xoá công việc này?')) {
      setTasks(tasks.filter(task => task.id !== id));
      message.success('Xóa công việc thành công!');
    }
  };

  const handleFilterChange = (value, field) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) return;
    const updated = Array.from(tasks);
    const [moved] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, moved);
    setTasks(updated);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ff4d4f', padding: '0 24px' }}>
        <Text style={{ color: '#fff', fontSize: '18px' }}>
          Chào mừng, <strong>{user.username}</strong>!
        </Text>
        <Button onClick={onLogout} style={{ backgroundColor: '#fff', color: '#ff4d4f', borderColor: '#ff4d4f' }}>
          Đăng xuất
        </Button>
      </Header>

      <Content style={{ padding: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5', flexGrow: 1 }}>
        <div className="task-manager-container">
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={8}>
              <Input placeholder="Tìm kiếm công việc" value={filters.search} onChange={e => handleFilterChange(e.target.value, 'search')} />
            </Col>
            <Col span={8}>
              <Select placeholder="Lọc theo trạng thái" style={{ width: '100%' }} value={filters.status} onChange={value => handleFilterChange(value, 'status')}>
                <Option value="">Tất cả trạng thái</Option>
                <Option value="Chưa làm">Chưa làm</Option>
                <Option value="Đang làm">Đang làm</Option>
                <Option value="Đã xong">Đã xong</Option>
              </Select>
            </Col>
            <Col span={8}>
              <Input placeholder="Lọc theo người được giao" value={filters.assignee} onChange={e => handleFilterChange(e.target.value, 'assignee')} />
            </Col>
          </Row>

          <TaskStatistics tasks={tasks} />
          <TaskForm
            form={form}
            onFinish={onFinish}
            editingTaskId={editingTaskId}
            cancelEdit={() => {
              form.resetFields();
              setEditingTaskId(null);
            }}
          />
          <TaskTable
            filteredTasks={filteredTasks}
            onDragEnd={handleDragEnd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default TaskManager;
