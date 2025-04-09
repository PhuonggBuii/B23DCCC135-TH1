declare module QuanLyUngVien{
	export interface UngVien {
        id: string;
        hoTen: string;
        email: string;
        nguyenVong: string;
        lyDo: string;
        trangThai: "Pending" | "Approved" | "Rejected";
        ghiChu?: string;
      }
}