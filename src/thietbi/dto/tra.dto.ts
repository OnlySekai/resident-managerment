import { CreateSaokeDto } from './create-saoke.dto';

export interface TraDto {
  phieuMuonId: number;
  note?: TinhTrangDto[];
  saoKe: CreateSaokeDto;
  ngayTra: Date;
}

interface TinhTrangDto {
  taiNguyenId: number;
  tinh_trang: number;
  mo_ta: string;
}
