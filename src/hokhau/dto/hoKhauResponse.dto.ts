import { HokhauDto } from 'src/dto/hoKhau.dto';

export interface HoKhauResponseDto extends HokhauDto {
  nhanKhau: number[];
}
