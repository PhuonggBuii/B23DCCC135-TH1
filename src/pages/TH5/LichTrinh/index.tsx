import React, { useState, useEffect } from "react";
import {
    Card,
    Button,
    Select,
    Row,
    Col,
    Typography,
    message,
    Divider,
    InputNumber,
    notification,
    Progress,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Pie } from "@ant-design/plots";

const { Title } = Typography;
const { Option } = Select;

type Destination = {
    id: number;
    name: string;
    image: string;
    location: string;
    rating: number;
    price: number;
    type: string;
};

type ItineraryDay = {
    day: number;
    destinations: Destination[];
    transportCost: number;
    accommodationCost: number;
    foodCost: number;
};

const LOCAL_STORAGE_KEY = "travelPlannerData";
const AVERAGE_TRAVEL_TIME_MINUTES = 90;

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
        image: "https://static.vinwonders.com/production/gioi-thieu-ve-da-lat-1.jpg",
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
        price: 2200000,
        type: "núi",
    },
];

const TravelPlanner: React.FC = () => {
    const [itinerary, setItinerary] = useState<ItineraryDay[]>([
        { day: 1, destinations: [], transportCost: 0, accommodationCost: 0, foodCost: 0 },
    ]);
    const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
    const [budgetLimit, setBudgetLimit] = useState<number>(10000000);
    const [actualTotal, setActualTotal] = useState<number>(0);
    const [overBudget, setOverBudget] = useState<boolean>(false);

    useEffect(() => {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setItinerary(parsedData.itinerary || []);
            setAllDestinations(parsedData.allDestinations || defaultDestinations);
            setBudgetLimit(parsedData.budgetLimit || 10000000);
        } else {
            setAllDestinations(defaultDestinations);
            localStorage.setItem(
                LOCAL_STORAGE_KEY,
                JSON.stringify({
                    itinerary: [],
                    allDestinations: defaultDestinations,
                    budgetLimit: 10000000,
                })
            );
        }
    }, []);

    useEffect(() => {
        const dataToSave = {
            itinerary,
            allDestinations,
            budgetLimit,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    }, [itinerary, allDestinations, budgetLimit]);

    const addDay = () => {
        setItinerary([
            ...itinerary,
            {
                day: itinerary.length + 1,
                destinations: [],
                transportCost: 0,
                accommodationCost: 0,
                foodCost: 0,
            },
        ]);
    };

    const handleAddDestination = (dayIndex: number, destinationId: number) => {
        const destination = allDestinations.find((d) => d.id === destinationId);
        if (!destination) return;

        const updated = [...itinerary];
        const exists = updated[dayIndex].destinations.find((d) => d.id === destinationId);
        if (exists) {
            message.warning("Điểm đến đã có trong ngày này!");
            return;
        }
        updated[dayIndex].destinations.push(destination);
        setItinerary(updated);
    };

    const removeDestination = (dayIndex: number, destIndex: number) => {
        const updated = [...itinerary];
        updated[dayIndex].destinations.splice(destIndex, 1);
        setItinerary(updated);
    };

    const updateCost = (dayIndex: number, type: keyof ItineraryDay, value: number) => {
        const updated = [...itinerary];
        updated[dayIndex][type] = value;
        setItinerary(updated);
    };

    const calculateDayTotal = (day: ItineraryDay) =>
        day.destinations.reduce((sum, d) => sum + d.price, 0) +
        day.transportCost +
        day.accommodationCost +
        day.foodCost;

    const calculateTravelTime = (day: ItineraryDay) =>
        Math.max(0, day.destinations.length - 1) * AVERAGE_TRAVEL_TIME_MINUTES;

    const calculateTotal = () =>
        itinerary.reduce((sum, day) => sum + calculateDayTotal(day), 0);

    const getBreakdown = () => {
        let thamquan = 0,
            diChuyen = 0,
            luuTru = 0,
            anUong = 0;

        itinerary.forEach((day) => {
            thamquan += day.destinations.reduce((sum, d) => sum + d.price, 0);
            diChuyen += day.transportCost;
            luuTru += day.accommodationCost;
            anUong += day.foodCost;
        });

        return [
            { type: "Tham quan", value: thamquan },
            { type: "Di chuyển", value: diChuyen },
            { type: "Lưu trú", value: luuTru },
            { type: "Ăn uống", value: anUong },
        ];
    };

    useEffect(() => {
        const total = calculateTotal();
        setActualTotal(total);
        if (total > budgetLimit) {
            setOverBudget(true);
            notification.warning({
                message: "Vượt ngân sách!",
                description: `Tổng chi phí là ${total.toLocaleString()} VND, vượt ngân sách hiện tại.`,
            });
        } else {
            setOverBudget(false);
        }
    }, [itinerary, budgetLimit]);

    const pieConfig = {
        data: getBreakdown(),
        angleField: "value",
        colorField: "type",
        radius: 1,
        innerRadius: 0.5,
        label: {
            type: "outer",
            content: "{name} ({percentage})",
        },
        interactions: [{ type: "element-active" }],
    };

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>Lập lịch trình & Quản lý ngân sách</Title>

            <Button
                onClick={addDay}
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginBottom: 20 }}
            >
                Thêm ngày
            </Button>

            {itinerary.map((day, dayIndex) => (
                <Card
                    key={day.day}
                    title={`Ngày ${day.day}`}
                    style={{ marginBottom: 24 }}
                    extra={
                        <Select
                            placeholder="Thêm điểm đến"
                            onSelect={(value) =>
                                handleAddDestination(dayIndex, parseInt(value.toString()))
                            }
                            style={{ width: 220 }}
                        >
                            {allDestinations.map((d) => (
                                <Option key={d.id} value={d.id}>
                                    {d.name} ({d.price.toLocaleString()} VND)
                                </Option>
                            ))}
                        </Select>
                    }
                >
                    <Row gutter={[16, 16]}>
                        {day.destinations.map((dest, destIndex) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={dest.id}>
                                <Card
                                    cover={<img alt={dest.name} src={dest.image} height={160} />}
                                    actions={[
                                        <Button
                                            type="link"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeDestination(dayIndex, destIndex)}
                                        >
                                            Xoá
                                        </Button>,
                                    ]}
                                >
                                    <Card.Meta
                                        title={dest.name}
                                        description={`${dest.location} - Giá: ${dest.price.toLocaleString()} VND`}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Divider />

                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <InputNumber
                                min={0}
                                max={10000000}
                                value={day.transportCost}
                                onChange={(value) => updateCost(dayIndex, "transportCost", value ?? 0)}
                                style={{ width: "100%" }}
                                addonBefore="Chi phí di chuyển"
                            />
                        </Col>
                        <Col span={12}>
                            <InputNumber
                                min={0}
                                max={10000000}
                                value={day.accommodationCost}
                                onChange={(value) => updateCost(dayIndex, "accommodationCost", value ?? 0)}
                                style={{ width: "100%" }}
                                addonBefore="Chi phí lưu trú"
                            />
                        </Col>
                        <Col span={12}>
                            <InputNumber
                                min={0}
                                max={10000000}
                                value={day.foodCost}
                                onChange={(value) => updateCost(dayIndex, "foodCost", value ?? 0)}
                                style={{ width: "100%" }}
                                addonBefore="Chi phí ăn uống"
                            />
                        </Col>
                    </Row>

                    <Divider />

                    <Row>
                        <Col span={12}>
                            <strong>Tổng chi phí ngày {day.day}: </strong>
                            {calculateDayTotal(day).toLocaleString()} VND
                        </Col>
                        <Col span={12}>
                            <strong>Thời gian di chuyển: </strong>
                            {calculateTravelTime(day)} phút
                        </Col>
                    </Row>
                </Card>
            ))}

            <Card title="Ngân sách dự kiến">
                <Row gutter={16}>
                    <Col span={12}>
                        <strong>Ngân sách dự kiến: </strong>
                        <InputNumber
                            value={budgetLimit}
                            onChange={(value) => setBudgetLimit(value ?? 0)}
                            min={0}
                            max={100000000}
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col span={12}>
                        <Title level={4} type={overBudget ? "danger" : "success"}>
                            {actualTotal.toLocaleString()} VND
                        </Title>
                        <Progress
                            percent={Math.min((actualTotal / budgetLimit) * 100, 100)}
                            status={overBudget ? "exception" : "active"}
                            showInfo
                        />
                    </Col>
                </Row>
            </Card>

            <Card title="Biểu đồ phân bổ chi phí">
                <Pie {...pieConfig} />
            </Card>
        </div>
    );
};

export default TravelPlanner;