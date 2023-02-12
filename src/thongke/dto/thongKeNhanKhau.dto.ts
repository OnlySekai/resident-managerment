import { GIOI_TINH, TINH_TRANG_TAM_TRU } from 'src/common/constant';

export interface ThongKeNhanKhauDto {
  gioi_tinh?: GIOI_TINH;
  tinh_trang?: TINH_TRANG_TAM_TRU;
  min_age?: number;
  max_age?: number;
}
