import { DonTachKhauDto } from 'src/dto/donTachKhau.dto';
import { DonTachKhauCungDto } from 'src/dto/donTachKhauCung.dto';

export interface InputTachKhauDto {
  donTachKhau: DonTachKhauDto;
  donTachKhauCung: Array<DonTachKhauCungDto>;
}
