import component from "@/locales/en-US/component";
import { icons } from "antd/lib/image/PreviewGroup";
import path from "path";

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todolist',
		name: 'Todolist',
		component: './Todolist',
		icon: 'UnorderedListOutlined',
	},
	{
		name:'TH1',
		path:'/TH1',
		icon:'QuestionOutlined',
		routes: [
			{
				path: 'random-number',
				name: 'RandomNumber',
				component: './TH1/RandomNumber',
				icon: 'QuestionOutlined',
			},
			{
				path: 'monhoc',
				name: 'Môn Học',
				component: './TH1/MonHoc',
				icon: 'PicRightOutlined',
			},
			{
				path: 'goal',
				name: 'Mục Tiêu',
				component: './TH1/MucTieu',
				icon: 'CheckCircleOutlined',  
			},
		]
	},
	{
		name:'TH2',
		path:'/TH2',
		icon:'UnorderedListOutlined',
		routes: [
			{
				path: 'tuti',
				name: 'Tù Tì',
				component: './TH2/TuTi',
				icon: 'BulbOutlined',
			},
			{
				path: 'QuanLyMonHoc',
				name: 'Quản lý môn học',
				component: './TH2/QuanLyMonHoc',
				icon: 'UnorderedListOutlined',  
			},
			{
				path: 'NganHangCauHoi',
				name: 'Ngân hàng câu hỏi',
				component: './TH2/NganHangCauHoi',
				icon: 'BankOutlined',  
			},
			{
				path: 'QuanLyDeThi',
				name: 'Quản lý đề thi',
				component: './TH2/QuanLyDeThi',
				icon: 'FileTextOutlined',  
			},
		]
	},
	{
		name: 'TH3',
		path: '/Quanly',
		icon: 'PlusOutlined',
		routes: [
			{
				path: 'QuanLyLichHen',
				name: 'Quản Lý Lịch Hẹn',
				component: './QuanLy/QuanLyLichHen',  
			},
			{
				path: 'QuanLyNhanVien',
				name: 'Quản Lý Nhân Viên',
				component: './QuanLy/QuanLyNhanVien',  
			},
			{
				path: 'QuanLyDichVu',
				name: 'Quản Lý Dịch Vụ',
				component: './QuanLy/QuanLyDichVu', 
			},
			{
				path: 'QuanLyDanhGia',
				name: 'Quản Lý Đánh Giá',
				component: './QuanLy/QuanLyDanhGia', 
			},
			{
				path: 'ThongKe',
				name: 'Thống Kê',
				component: './QuanLy/ThongKe',  
			},
		]
	},
	{
		name: 'Kiểm Tra Giữa Kỳ',
		path: '/GK',
		icon: 'PlusOutlined',
		routes: [
			{
				path: 'DanhSachKhachHang',
				name: 'Danh Sách Khách Hàng',
				component: './GK/DanhSachKhachHang',  
			},
			{
				path: 'DanhSachSanPham',
				name: 'Danh Sách Sản Phẩm',
				component: './GK/DanhSachSanPham',  
			},
			{
				path: 'DanhSachDonHang',
				name: 'Danh Sách Đơn Hàng',
				component: './GK/DanhSachDonHang',  
			},
		]
	},



	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
