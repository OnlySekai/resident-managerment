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
  trang_thai:
    | 'CREATE'
    | 'PAID'
    | 'REJECT'
    | 'CANCEL'
    | 'USING'
    | 'DONE'
    | 'MISSING'
    | 'LOSS';
  sao_ke_dang_ki?: number;
  sao_ke_tra?: number;
}
