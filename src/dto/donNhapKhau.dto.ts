export interface DonNhapKhauDto {
  id: number;
  dai_dien_id: number;
  dia_chi_co_quan: string;
  ngay_lam_don: Date;
  ngay_phe_duyet?: Date;
  user_phe_duyet?: number;
  ghi_chu?: string;
  so_ho_khau_moi_id?: number;
  ngay_chuyen: Date;
  ly_do?: string;
  dia_chi_moi: string;
  dia_chi_cu: string;
}