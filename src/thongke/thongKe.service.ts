import { Injectable, Query } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { ThongKeNhanKhauDto } from './dto/thongKeNhanKhau.dto';
import { ThongKeThietBiDto } from './dto/thongKeThietbi.dto';

@Injectable()
export class ThongKeService {
  constructor(private readonly db: DatabaseService) {}
  thongKeNhanKhau(@Query() query: ThongKeNhanKhauDto) {}
  // thongKeThietBi(@Query() query: ThongKeThietBiDto) {
  //   const { tinh_trang, ...restQuery } = query;
  //   let queryThietBi = this.db.tai_nguyen_table(true).where(restQuery);
  //   if (tinh_trang) {
  //     queryThietBi = queryThietBi.innerJoin(
  //       'phien_su_dung as psd',
  //       'tn.id',
  //       'psd.tai_nguyen_id',
  //     );
  //   }
  // }
  async thongKeHoKhau() {
    const [{ totalHokhau }, { totalChuHoDie }] = (await Promise.all([
      this.db.so_ho_khau_table().count({ totalHokhau: 'id' }),
      this.db
        .so_ho_khau_table(true)
        .innerJoin('giay_khai_tu as gkt', 'gkt.nhan_khai_id', 'shk.chu_ho_id')
        .count({ totalChuHoDie: 'chu_ho_id' }),
    ])) as any;
    return {
      totalHokhau,
      totalChuHoDie,
    };
  }
}
