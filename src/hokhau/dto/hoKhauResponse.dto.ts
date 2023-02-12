import { HokhauDto } from 'src/dto/hoKhau.dto';

export interface HoKhauResponseDto extends HokhauDto {
  nhanKhau: number[];
  nhanKhaus?: NhanKhauTrongNha[];
}

export interface NhanKhauTrongNha {
  id: number;
  ten: string;
  quan_he: string;
  cccd?: string;
}
