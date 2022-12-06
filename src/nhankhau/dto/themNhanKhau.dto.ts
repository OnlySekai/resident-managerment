import { GiayKhaiSinhDto } from "src/dto/giayKhaiSinh.dto";
import { nhanKhauDto } from "src/dto/nhanKhau.dto";

export interface ThemNhanKhauDto {
  nhanKhauInfo: nhanKhauDto,
  hokhau?: number,
  quanHeChuHo?: string,
  giayKhaiSinh?: GiayKhaiSinhDto
}