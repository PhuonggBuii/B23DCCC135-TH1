import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const { Option } = Select;

const TaskForm = ({ form, onFinish, editingTaskId, cancelEdit }) => (
  <Form
    form={form}
    layout="inline"
    onFinish={onFinish}
    style={{ marginBottom: 20, flexWrap: 'wrap', gap: 10 }}
  >
    <Form.Item name="name" rules={[{ required: true, message: 'Nhập tên công việc' }]}>
      <Input placeholder="Tên công việc" />
    </Form.Item>
    <Form.Item name="assignee" rules={[{ required: true, message: 'Nhập người được giao' }]}>
      <Input placeholder="Người được giao" />
    </Form.Item>
    <Form.Item name="priority" initialValue="Trung bình">
      <Select style={{ width: 120 }}>
        <Option value="Thấp">Thấp</Option>
        <Option value="Trung bình">Trung bình</Option>
        <Option value="Cao">Cao</Option>
      </Select>
    </Form.Item>
    <Form.Item name="status" initialValue="Chưa làm">
      <Select style={{ width: 120 }}>
        <Option value="Chưa làm">Chưa làm</Option>
        <Option value="Đang làm">Đang làm</Option>
        <Option value="Đã xong">Đã xong</Option>
      </Select>
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">
        {editingTaskId ? 'Cập nhật' : 'Thêm'}
      </Button>
    </Form.Item>
    {editingTaskId && (
      <Form.Item>
        <Button onClick={cancelEdit}>Hủy</Button>
      </Form.Item>
    )}
  </Form>
);

export default TaskForm;