import { DonChuyenKhauDto } from 'src/dto/donChuyenKhau.dto';

export interface InputChuyenKhauDto {
  donChuyenKhauKhau: DonChuyenKhauDto;
  donChuyenKhauCung: Array<DonChuyenKhauDto>;
}
