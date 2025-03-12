import { Layout, Typography, Button } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
const { Header, Content } = Layout;
const { Title } = Typography;



const Todolist = () => {
    
    return (
        <Layout>
            <Header 
                className="header" 
                style={{
                    backgroundColor: "#F0F2F5", 
                    display: "flex", 
                    flexDirection: "column",
                    alignItems: "center", 
                    justifyContent: "center",
                    padding: "20px"
                }}
            >
                <Title level={2} style={{ color: "black", marginBottom: "10px" }}>
                    Todo List
                </Title>
                <Button type="primary" icon={<PlusOutlined />} style={{ marginTop: 10 }}>Create Task</Button>
            </Header>
        </Layout>
	);
}

export default Todolist;