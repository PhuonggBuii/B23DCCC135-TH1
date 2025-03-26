import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Question {
  id: number;
  subject: string;
  topics: string[];
  content: string;
  difficulty: string;
}

interface Subject {
  id: number;
  name: string;
  topics: string[];
}

const difficultyLevels = ["Dễ", "Trung bình", "Khó", "Rất khó"];

const NganHangCauHoi: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchSubject, setSearchSubject] = useState("");
  const [searchDifficulty, setSearchDifficulty] = useState("");
  const [searchTopic, setSearchTopic] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
    const storedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    setQuestions(storedQuestions);
    setSubjects(storedSubjects);
  }, []);

  const saveToLocalStorage = (data: Question[]) => {
    localStorage.setItem("questions", JSON.stringify(data));
  };

  const filteredQuestions = questions.filter((q) => {
    return (
      (searchSubject ? q.subject === searchSubject : true) &&
      (searchDifficulty ? q.difficulty === searchDifficulty : true) &&
      (searchTopic ? q.topics.includes(searchTopic) : true)
    );
  });

  const openModal = (question?: Question) => {
    setIsEdit(!!question);
    setEditingQuestion(question || null);
    setSelectedSubject(question?.subject || "");
    setVisible(true);
    form.setFieldsValue(question || { subject: "", topics: [], content: "", difficulty: "" });
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      let updatedQuestions;
      if (isEdit && editingQuestion) {
        updatedQuestions = questions.map((q) =>
          q.id === editingQuestion.id ? { ...values, id: q.id } : q
        );
      } else {
        const newQuestion: Question = { ...values, id: Date.now() };
        updatedQuestions = [...questions, newQuestion];
      }
      setQuestions(updatedQuestions);
      saveToLocalStorage(updatedQuestions);
      setVisible(false);
      setEditingQuestion(null);
      form.resetFields();
    });
  };

  const handleDelete = (id: number) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions);
    saveToLocalStorage(updatedQuestions);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Select
          placeholder="Chọn môn học"
          onChange={(value) => setSearchSubject(value)}
          allowClear
        >
          {subjects.map((subject) => (
            <Select.Option key={subject.id} value={subject.name}>
              {subject.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Chọn mức độ khó"
          onChange={(value) => setSearchDifficulty(value)}
          allowClear
        >
          {difficultyLevels.map((level) => (
            <Select.Option key={level} value={level}>
              {level}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Chọn khối kiến thức"
          onChange={(value) => setSearchTopic(value)}
          allowClear
        >
          {Array.from(new Set(questions.flatMap((q) => q.topics))).map((topic, index) => (
            <Select.Option key={index} value={topic}>
              {topic}
            </Select.Option>
          ))}
        </Select>
      </div>

      <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
        Thêm câu hỏi
      </Button>

      <Table
        dataSource={filteredQuestions}
        rowKey="id"
        style={{ marginTop: 20 }}
        bordered
        columns={[
          {
            title: "Môn học",
            dataIndex: "subject",
            key: "subject",
          },
          {
            title: "Khối kiến thức",
            dataIndex: "topics",
            key: "topics",
            render: (topics: string[]) => topics.map((topic) => <Tag color="blue" key={topic}>{topic}</Tag>),
          },
          {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
          },
          {
            title: "Mức độ khó",
            dataIndex: "difficulty",
            key: "difficulty",
            align: "center",
            render: (difficulty: string) => {
              const difficultyColors: Record<string, string> = {
                "Dễ": "green",
                "Trung bình": "blue",
                "Khó": "orange",
                "Rất khó": "red",
              };
          
              return <Tag color={difficultyColors[difficulty] || "default"}>{difficulty}</Tag>;
            },
          },
          {
            title: "Hành động",
            key: "actions",
            render: (_: any, record: Question) => (
              <>
                <Button icon={<EditOutlined />} onClick={() => openModal(record)} style={{ marginRight: 8 }} />
                <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger />
              </>
            ),
          },
        ]}
      />

      <Modal
        destroyOnClose
        footer={false}
        title={isEdit ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi"}
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setEditingQuestion(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          <Form.Item name="subject" label="Môn học" rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}>            
            <Select onChange={(value) => setSelectedSubject(value)}>
              {subjects.map((subject) => (
                <Select.Option key={subject.id} value={subject.name}>
                  {subject.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="topics" label="Khối kiến thức" rules={[{ required: true, message: "Chọn ít nhất một khối kiến thức!" }]}>            
            <Select mode="multiple" placeholder="Chọn khối kiến thức">
              {subjects.find((s) => s.name === selectedSubject)?.topics.map((topic, index) => (
                <Select.Option key={index} value={topic}>
                  {topic}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="content" label="Nội dung câu hỏi" rules={[{ required: true, message: "Nhập nội dung câu hỏi!" }]}>            
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="difficulty" label="Mức độ khó" rules={[{ required: true, message: "Chọn mức độ khó!" }]}>            
            <Select>
              {difficultyLevels.map((level) => (
                <Select.Option key={level} value={level}>
                  {level}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">{isEdit ? "Cập nhật" : "Thêm mới"}</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NganHangCauHoi;