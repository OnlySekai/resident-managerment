import { queryGetDonDto } from 'src/common/queryGetDon.dto';
import { GiayKhaiSinhDto } from 'src/dto/giayKhaiSinh.dto';
export interface searchKhaiSinh extends queryGetDonDto, GiayKhaiSinhDto {
  id: string;
  cccd: string;
  ten: string;
  ten_bo: string;
  ten_me: string;
  cccd_bo: string;
  cccd_me: string;
}
