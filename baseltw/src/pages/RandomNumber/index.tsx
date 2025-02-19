import { useState, useEffect } from "react";
import { Layout, Typography, Button, Input, Space, message } from "antd";

const { Header } = Layout;
const { Title, Text } = Typography;

const RandomNumber = () => {
  const [value, setValue] = useState("");
  const [randomNumber, setRandomNumber] = useState(10);
  const [attempts, setAttempts] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const startNewGame = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
    setValue("");
    setAttempts(10);
    setGameOver(false);
    setResultMessage("");
    message.info("Game start! Hãy nhập số từ 1 đến 100.");
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleSubmit = () => {
    if (gameOver) return;

    let num = Number(value);
    if (isNaN(num) || num < 1 || num > 100) {
      message.error("Vui lòng nhập số từ 1 đến 100!");
      return;
    }

    if (num === randomNumber) {
      message.success("Chúc mừng! Bạn đã đoán đúng!");
      setResultMessage("Chúc mừng! Bạn đã đoán đúng!");
      setGameOver(true);
    } else {
      setAttempts(attempts - 1);
      if (attempts - 1 === 0) {
        message.error(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`);
        setResultMessage(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`)
        setGameOver(true);
      } else {
        message.warning(num < randomNumber ? "Bạn đoán quá thấp!" : "Bạn đoán quá cao!");
      }
    }
    setValue("");
  };

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
          padding: "20px",
          minHeight: "70vh",
        }}
      >
        <Title level={1} style={{ color: "black", marginBottom: "10px" }}>
          Random Number
        </Title>
        <Typography.Text strong>Bạn có {attempts} lượt để đoán!</Typography.Text>

        <Space style={{ marginTop: 20 }}>
          <Input
            placeholder="Nhập số bạn đoán"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ width: 150 }}
            disabled={gameOver}
          />
          <Button type="primary" onClick={handleSubmit} disabled={gameOver}>
            Đoán
          </Button>
        </Space>

        {gameOver && (
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <Text strong style={{ color: "red", fontSize: 16 }}>{resultMessage}</Text>
            <div style={{ marginTop: 10 }}>
                <Button type="dashed" onClick={startNewGame}>
                    Restart
                </Button>
            </div>
          </div>
        )}
      </Header>
    </Layout>
  );
};

export default RandomNumber;
