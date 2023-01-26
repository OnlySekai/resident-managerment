import { THIET_BI_STATUS } from 'src/common/constant';

export class CreatePhieuMuonDto {
  id?: number;
  cccd: string;
  ho_va_ten: string;
  so_dien_thoai: string;
  email: string;
  user_tao: number;
  user_phe_duyet?: number;
  ngay_phe_duyet?: number;
  ly_do: string;
  trang_thai: THIET_BI_STATUS;
  sao_ke_dang_ki?: number;
  sao_ke_tra?: number;
}
