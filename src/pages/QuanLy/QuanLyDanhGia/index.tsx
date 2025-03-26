import React, { useEffect, useState } from "react";
import { Table, Tag, Tooltip, Button, Modal, Input, message } from "antd";
import { StarOutlined, WarningOutlined } from "@ant-design/icons";

interface Feedback {
    id: number;
    name: string;
    date: string;
    service: string;
    rating: number;
    feedback: string;
    employeeId?: number;
    employeeResponse?: string;
}

interface Employee {
    id: number;
    name: string;
    rating: number;
    feedbackCount: number;
}

const DanhGia: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [responseModalVisible, setResponseModalVisible] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [employeeResponse, setEmployeeResponse] = useState<string>("");

    useEffect(() => {
        const storedFeedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
        setFeedbacks(storedFeedbacks);

        const storedEmployees = JSON.parse(localStorage.getItem("employees") || "[]");
        setEmployees(storedEmployees);
    }, []);

    const handleResponseSubmit = () => {
        if (selectedFeedback && employeeResponse) {
            const updatedFeedbacks = feedbacks.map(feedback =>
                feedback.id === selectedFeedback.id
                    ? { ...feedback, employeeResponse }
                    : feedback
            );
            setFeedbacks(updatedFeedbacks);
            localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks));

            message.success("Phản hồi thành công!");
            setResponseModalVisible(false);
            setEmployeeResponse(""); 
        }
    };

    const columns = [
        { title: "Họ và Tên", dataIndex: "name", key: "name" },
        { title: "Ngày hẹn", dataIndex: "date", align:'center', key: "date" },
        { title: "Dịch vụ", dataIndex: "service",align:'center', key: "service" },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
            align:'center',
            render: (rating: number) => (
                <Tag color="gold">
                    <StarOutlined /> {rating} sao
                </Tag>
            ),
        },
        {
            title: "Phản hồi",
            dataIndex: "feedback",
            key: "feedback",
            render: (feedback: string, record: Feedback) => (
                <Tooltip title={feedback}>
                    <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {feedback}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Nhân viên được đánh giá",
            dataIndex: "employeeId",
            key: "employeeId",
            align:'center',
            render: (employeeId: number) => {
                const employee = employees.find(emp => emp.id === employeeId);
                return employee ? employee.name : "Không xác định";
            },
        },
        {
            title: "Phản hồi của nhân viên",
            dataIndex: "employeeResponse",
            key: "employeeResponse",
            render: (employeeResponse: string) => (
                <Tooltip title={employeeResponse}>
                    <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {employeeResponse || "Chưa có phản hồi"}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Phản hồi",
            key: "action",
            align:'center',
            render: (_: any, record: Feedback) => (
                <Button
                    type="link"
                    icon={<WarningOutlined />}
                    onClick={() => {
                        setSelectedFeedback(record);
                        setResponseModalVisible(true);
                    }}
                />
            ),
        },
    ];

    const employeeRatings = employees.map(employee => {
        const employeeFeedbacks = feedbacks.filter(feedback => feedback.employeeId === employee.id);

        const feedbackCount = employeeFeedbacks.length;
        const totalRating = employeeFeedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);

        const averageRating = feedbackCount > 0 ? totalRating / feedbackCount : 0;

        return {
            ...employee,
            rating: averageRating,  
            feedbackCount,  
        };
    });

    const ratingColumns = [
        { title: "Nhân viên",align:'center', dataIndex: "name", key: "name" },
        { title: "Số đánh giá", dataIndex: "feedbackCount",align:'center', key: "feedbackCount" },
        {
            title: "Đánh giá trung bình",
            dataIndex: "rating",
            key: "rating",
            align:'center',
            render: (rating: number) => (
                <Tag color="gold">
                    <StarOutlined /> {rating} sao
                </Tag>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <h2>Danh sách Đánh Giá</h2>
            <Table columns={columns} dataSource={feedbacks} rowKey="id" style={{ marginBottom: 40 }} />

            <h3>Đánh giá trung bình của các nhân viên</h3>
            <Table columns={ratingColumns} dataSource={employeeRatings} rowKey="id" />

            <Modal
                title="Phản hồi đánh giá"
                visible={responseModalVisible}
                onCancel={() => setResponseModalVisible(false)}
                footer={null}
            >
                <Input.TextArea
                    value={employeeResponse}
                    onChange={(e) => setEmployeeResponse(e.target.value)}
                    placeholder="Nhập phản hồi của bạn"
                    rows={4}
                />
                <div style={{ marginTop: 10, textAlign: "right" }}>
                    <Button onClick={() => setResponseModalVisible(false)} style={{ marginRight: 8 }}>
                        Hủy
                    </Button>
                    <Button type="primary" onClick={handleResponseSubmit}>
                        Gửi phản hồi
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default DanhGia;