import React from 'react';
import { Table, Button, Space } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskTable = ({ filteredTasks, onDragEnd, onEdit, onDelete }) => {
  const columns = [
    { title: 'Tên công việc', dataIndex: 'name', key: 'name' },
    { title: 'Người được giao', dataIndex: 'assignee', key: 'assignee' },
    { title: 'Ưu tiên', dataIndex: 'priority', key: 'priority' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => onEdit(record)}>Sửa</Button>
          <Button danger onClick={() => onDelete(record.id)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Table
        columns={columns}
        dataSource={[]}
        pagination={false}
        rowKey="id"
        components={{
          body: {
            wrapper: (props) => (
              <Droppable droppableId="taskList">
                {(provided) => (
                  <tbody
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    {...props}
                  >
                    {filteredTasks.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <td>{item.name}</td>
                            <td>{item.assignee}</td>
                            <td>{item.priority}</td>
                            <td>{item.status}</td>
                            <td>
                              <Space>
                                <Button onClick={() => onEdit(item)}>Sửa</Button>
                                <Button danger onClick={() => onDelete(item.id)}>Xóa</Button>
                              </Space>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            ),
          },
        }}
      />
    </DragDropContext>
  );
};

export default TaskTable;