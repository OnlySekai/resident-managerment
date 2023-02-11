import { queryGetDonDto } from "src/common/queryGetDon.dto";
import { GiayKhaiTuDto } from "src/dto/giayKhaiTu.dto";

export interface searchKhaiTuDto extends queryGetDonDto, GiayKhaiTuDto {
  id: number,


}