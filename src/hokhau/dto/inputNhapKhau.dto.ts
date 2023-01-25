import { DonNhapKhauDto } from "src/dto/donNhapKhau.dto";
import { DonNhapKhauCungDto } from "src/dto/donNhapKhauCung.dto";

export interface InnputDonNhapKhauDto {
  donNhapKhau: DonNhapKhauDto;
  donNhapKhauCung: DonNhapKhauCungDto[]
}