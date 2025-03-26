import { useState, useEffect } from "react";
import { Button, Card, Table, Typography, Space } from "antd";

type Chon = "Kéo" | "Búa" | "Bao";
type KetQua = "Hòa" | "Người chơi thắng" | "Máy tính thắng";

interface GameRecord {
  player: Chon;
  computer: Chon;
  result: KetQua;
}

const { Title } = Typography;
const choices: Chon[] = ["Kéo", "Búa", "Bao"];
const colors: Record<Chon, string> = {
  "Kéo": "#ff4d4f",  
  "Búa": "#40a9ff",  
  "Bao": "#52c41a"   
};

const mayChon = (): Chon => {
  return choices[Math.floor(Math.random() * choices.length)];
};

const Win = (player: Chon, computer: Chon): KetQua => {
  if (player === computer) return "Hòa";
  if (
    (player === "Kéo" && computer === "Bao") ||
    (player === "Búa" && computer === "Kéo") ||
    (player === "Bao" && computer === "Búa")
  ) {
    return "Người chơi thắng";
  }
  return "Máy tính thắng";
};

const Tuti = () => {
  const [history, setHistory] = useState<GameRecord[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("gameHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const playGame = (nguoiChon: Chon) => {
    const may = mayChon();
    const ketqua = Win(nguoiChon, may);

    const record: GameRecord = {
      player: nguoiChon,
      computer: may,
      result: ketqua,
    };

    const newHistory = [record, ...history];
    setHistory(newHistory);
    localStorage.setItem("gameHistory", JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("gameHistory");
  };

  const columns = [
    {
      title: "Người chơi",
      dataIndex: "player",
      key: "player",
      align: "center"
    },
    {
      title: "Máy",
      dataIndex: "computer",
      key: "computer",
      align: "center"
    },
    {
      title: "Kết quả",
      dataIndex: "result",
      key: "result",
      align: "center",
      render: (result: KetQua) => {
        let color = "default";
        if (result === "Người chơi thắng") color = "green";
        else if (result === "Hòa") color = "gray";
        else if (result === "Máy tính thắng") color = "red";
        return (
          <span style={{ fontWeight: "bold", color }}>
            {result}
          </span>
        );
      },
    },
  ];

  return (
    <Card style={{ maxWidth: 600, margin: "20px auto", textAlign: "center" }} bordered>
      <Title level={2}>Trò chơi Kéo - Búa - Bao</Title>

      <Space size="large">
        {choices.map((choice) => (
          <Button
            key={choice}
            shape="round"
            size="large"
            style={{
              backgroundColor: colors[choice],
              color: "white",
              borderColor: colors[choice],
            }}
            onClick={() => playGame(choice)}
          >
            {choice}
          </Button>
        ))}
      </Space>

      <Title level={3} style={{ marginTop: 20 }}>Lịch sử đối đầu:</Title>
      <Table
        dataSource={history}
        columns={columns}
        rowKey={(_, index) => index.toString()}
        pagination={false}
        style={{ maxHeight: 300, overflowY: "auto" }}
      />

      {history.length > 0 && (
        <Button type="primary" danger onClick={clearHistory} style={{ marginTop: 10 }}>
          Xóa lịch sử đối đầu
        </Button>
      )}
    </Card>
  );
};

export default Tuti;
