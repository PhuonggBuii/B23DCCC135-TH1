import React, { useState, useEffect } from "react";
import {
  Card,
  Rate,
  Select,
  Row,
  Col,
  InputNumber,
  Typography,
  Space,
} from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import type { Destination } from "../../../services/KhamPhaDiemDen/typings";

const { Option } = Select;
const { Title } = Typography;

const LOCAL_STORAGE_KEY = "destinations";

const defaultDestinations: Destination[] = [
  {
    id: 1,
    name: "Vịnh Hạ Long",
    image:
      "https://media-cdn-v2.laodong.vn/storage/newsportal/2023/10/12/1253579/Vinh-Ha-Long-1.jpg",
    location: "Quảng Ninh",
    rating: 4.8,
    price: 1500000,
    type: "biển",
  },
  {
    id: 2,
    name: "Đà Lạt",
    image:
      "https://static.vinwonders.com/production/gioi-thieu-ve-da-lat-1.jpg",
    location: "Lâm Đồng",
    rating: 4.6,
    price: 1200000,
    type: "núi",
  },
  {
    id: 3,
    name: "Hà Nội",
    image:
      "https://cellphones.com.vn/sforum/wp-content/uploads/2024/01/dia-diem-du-lich-o-ha-noi-1.jpg",
    location: "Hà Nội",
    rating: 4.4,
    price: 1000000,
    type: "thành phố",
  },
  {
    id: 4,
    name: "Sapa",
    image:
      "https://hanoitourist.com.vn/images/destination/2021/07/16/large/3_fansipan-sapa-kynghidongduong-vn-03_1626382049.jpg",
    location: "Sapa",
    rating: 4.99,
    price: 22000000,
    type: "thành phố",
  },
];

const DestinationExplorer: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<string | undefined>();

  // Load data từ localStorage khi component được mount
  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      setDestinations(JSON.parse(storedData));
    } else {
      setDestinations(defaultDestinations);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultDestinations));
    }
  }, []);

  const filteredData = destinations
    .filter((d) => (typeFilter ? d.type === typeFilter : true))
    .filter((d) => (maxPrice ? d.price <= maxPrice : true))
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price") return a.price - b.price;
      return 0;
    });

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Khám phá điểm đến</Title>

      <Space style={{ marginBottom: 20 }} wrap>
        <Select
          placeholder="Loại hình"
          onChange={(value) => setTypeFilter(value)}
          allowClear
          style={{ width: 150 }}
        >
          <Option value="biển">Biển</Option>
          <Option value="núi">Núi</Option>
          <Option value="thành phố">Thành phố</Option>
        </Select>

        <InputNumber
          placeholder="Giá tối đa"
          onChange={(value) => setMaxPrice(value ?? undefined)}
          min={0}
          max={10000000}
          step={500000}
          style={{ width: 150 }}
        />

        <Select
          placeholder="Sắp xếp theo"
          onChange={(value) => setSortBy(value)}
          allowClear
          style={{ width: 180 }}
        >
          <Option value="rating">Đánh giá cao nhất</Option>
          <Option value="price">Giá thấp đến cao</Option>
        </Select>
      </Space>

      <Row gutter={[16, 16]}>
        {filteredData.map((d) => (
          <Col
            key={d.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              hoverable
              style={{ width: 260 }}
              cover={<img alt={d.name} src={d.image} height={160} />}
            >
              <Card.Meta
                title={d.name}
                description={
                  <>
                    <p>
                      <EnvironmentOutlined /> {d.location}
                    </p>
                    <p>Giá: {d.price.toLocaleString()} VND</p>
                    <Rate disabled defaultValue={d.rating} allowHalf />
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DestinationExplorer;