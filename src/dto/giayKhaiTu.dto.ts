export interface GiayKhaiTuDto {
  nhan_khau_id: number;
  // Những trường cần truyền
  ngay_khai_tu: Date;
  ngay_lam_giay: Date;
  nguoi_lam_giay_id: number;
  quan_he: string;
  ghi_chu: string;
}
