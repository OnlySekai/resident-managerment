import { DonChuyenKhauDto } from 'src/dto/donChuyenKhau.dto';
import { donChuyenKhauCung } from 'src/dto/donChuyenKhauCung.dto';

export interface InputChuyenKhauDto {
  donChuyenKhau: DonChuyenKhauDto;
  donChuyenKhauCung: Array<donChuyenKhauCung>;
}
