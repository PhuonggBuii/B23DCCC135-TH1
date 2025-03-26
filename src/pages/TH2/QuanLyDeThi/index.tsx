import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Select, InputNumber, Tag, Input } from "antd";
import { PlusOutlined, EyeOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";

interface Question {
  id: number;
  subject: string;
  topics: string[];
  content: string;
  difficulty: string;
}

interface Exam {
  id: number;
  name: string;
  subject: string;
  questions: Question[];
}

const difficultyLevels = ["Dễ", "Trung bình", "Khó", "Rất khó"];

const TaoDeThi: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [visible, setVisible] = useState(false);
  const [previewExam, setPreviewExam] = useState<Question[]>([]);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [searchSubject, setSearchSubject] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
    const storedExams = JSON.parse(localStorage.getItem("exams") || "[]");
    setQuestions(storedQuestions);
    setExams(storedExams);
  }, []);

  const handleGenerateExam = (values: any) => {
    const { subject, questionCounts } = values;
    const filteredQuestions = questions.filter((q) => q.subject === subject);

    let selectedQuestions: Question[] = [];
    Object.keys(questionCounts).forEach((difficulty) => {
      let count = questionCounts[difficulty] || 0;
      let availableQuestions = filteredQuestions.filter((q) => q.difficulty === difficulty);
      selectedQuestions.push(...availableQuestions.slice(0, count));
    });

    setPreviewExam(selectedQuestions);
  };

  const handleSaveExam = () => {
    const values = form.getFieldsValue();
    const newExam: Exam = {
      id: editingExam ? editingExam.id : Date.now(),
      name: values.examName,
      subject: values.subject,
      questions: previewExam,
    };
  
    let updatedExams = editingExam
      ? exams.map((exam) => (exam.id === editingExam.id ? newExam : exam))
      : [...exams, newExam];
  
    setExams(updatedExams);
    localStorage.setItem("exams", JSON.stringify(updatedExams));
    setVisible(false);
    setPreviewExam([]);
    setEditingExam(null);
    form.resetFields(); 
  };
  

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setVisible(true);
    setPreviewExam(exam.questions);

    const questionCounts = exam.questions.reduce((counts: any, q) => {
      counts[q.difficulty] = (counts[q.difficulty] || 0) + 1;
      return counts;
    }, {});

    form.setFieldsValue({
      examName: exam.name,
      subject: exam.subject,
      questionCounts: questionCounts,
    });
  };

  const handleDeleteExam = (examId: number) => {
    const updatedExams = exams.filter((exam) => exam.id !== examId);
    setExams(updatedExams);
    localStorage.setItem("exams", JSON.stringify(updatedExams));
  };

  const filteredExams = exams.filter((exam) => (searchSubject ? exam.subject === searchSubject : true));

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Select placeholder="Chọn môn học" onChange={(value) => setSearchSubject(value)} allowClear>
          {[...new Set(questions.map((q) => q.subject))].map((subject, index) => (
            <Select.Option key={index} value={subject}>
              {subject}
            </Select.Option>
          ))}
        </Select>
      </div>

      <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
        Tạo đề thi
      </Button>

      <Modal title={editingExam ? "Chỉnh sửa đề thi" : "Tạo Đề Thi"} visible={visible} onCancel={() => setVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleGenerateExam}>
          <Form.Item name="examName" label="Tên đề thi" rules={[{ required: true, message: "Vui lòng nhập tên đề thi!" }]}>
            <Input placeholder="Nhập tên đề thi" />
          </Form.Item>

          <Form.Item name="subject" label="Chọn môn học" rules={[{ required: true }]}>
            <Select>
              {[...new Set(questions.map((q) => q.subject))].map((subject, index) => (
                <Select.Option key={index} value={subject}>
                  {subject}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {difficultyLevels.map((level) => (
            <Form.Item key={level} name={["questionCounts", level]} label={`Số câu ${level}`} initialValue={0}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          ))}

          <Button type="primary" htmlType="submit" icon={<EyeOutlined />}>Xem trước</Button>
        </Form>
      </Modal>

      {previewExam.length > 0 && (
        <Modal title="Xem trước đề thi" visible={previewExam.length > 0} onCancel={() => setPreviewExam([])} footer={[
          <Button key="save" type="primary" icon={<SaveOutlined />} onClick={handleSaveExam}>Lưu đề thi</Button>,
        ]}>
          <Table dataSource={previewExam} rowKey="id" columns={[
            { title: "Nội dung", dataIndex: "content", key: "content" },
            { title: "Khối kiến thức", dataIndex: "topics", key: "topics", render: (topics) => topics.map((t: string) => <Tag key={t}>{t}</Tag>) },
            { title: "Mức độ", dataIndex: "difficulty", key: "difficulty" },
          ]} />
        </Modal>
      )}

      <Table dataSource={filteredExams} rowKey="id" columns={[
        { title: "Tên đề thi", dataIndex: "name", key: "name" },
        { title: "Môn học", dataIndex: "subject", key: "subject" },
        { title: "Số câu hỏi", dataIndex: "questions", key: "questions", render: (questions: Question[]) => questions.length },
        { title: "Hành động", key: "action", render: (text, record: Exam) => (
          <div>
            <Button icon={<EditOutlined />} onClick={() => handleEditExam(record)} style={{ marginRight: 8 }} />
            <Button danger onClick={() => handleDeleteExam(record.id)}>Xóa</Button>
          </div>
        ) },
      ]} />
    </div>
  );
};

export default TaoDeThi;