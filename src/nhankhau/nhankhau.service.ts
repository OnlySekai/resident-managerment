import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { DondinhChinhNhanKhauDto } from 'src/dto/donDinhChinhNhanKhau.dto';
import { GiayKhaiSinhDto } from 'src/dto/giayKhaiSinh.dto';
import { GiayKhaiTuDto } from 'src/dto/giayKhaiTu.dto';
import { nhanKhauDto } from 'src/dto/nhanKhau.dto';

@Injectable()
export class NhankhauService {
  constructor(private readonly db: DatabaseService) {}
  themNhanKhau(
    nhanhKhauInfo: nhanKhauDto,
    { giayKhaiSinh, hokhau, quanHeChuHo },
  ) {
    return this.db.knex.transaction(async (trx) => {
      const nhanKhauIds = await trx.insert(nhanhKhauInfo).into('nhan_khau');

      const ho_khau_id = giayKhaiSinh
        ? await trx
            .select('ho_khau_id')
            .from('nhan_khau_so_ho_hau')
            .where(
              'nhan_khau_id',
              giayKhaiSinh.bo_id ? giayKhaiSinh.bo_id : giayKhaiSinh.me_id,
            )
        : hokhau;
      const quan_he_chu_ho = giayKhaiSinh ? 'Con' : quanHeChuHo;
      await trx.insert({
        nhan_khau_id: nhanKhauIds[0],
        ho_khau_id,
        quan_he_chu_ho,
      });
      if (giayKhaiSinh) trx.insert(giayKhaiSinh).into('giay_khai_sinh');
    });
  }
  xoaNhanKhau(ids: Array<number>, giayKhaiTu?: Array<GiayKhaiTuDto>) {
    return this.db.knex.transaction((trx) => {
      this.db
        .delByIds('nhan_khau', ...ids)
        .transacting(trx)
        .then(() =>
          this.db
            .nhan_khau_so_ho_khau_table()
            .whereIn('nhan_khau', ids)
            .transacting(trx),
        )
        .then(() => {
          if (giayKhaiTu.length > 0)
            this.db.giay_khai_tu_table().insert(giayKhaiTu);
        })
        .then(trx.commit)
        .then(trx.rollback);
    });
  }
  suaNhanKhau(
    infos: Array<nhanKhauDto>,
    donDinhChinhNhanKhau?: Array<DondinhChinhNhanKhauDto>,
  ) {
    const idsAndData = infos.reduce((pre, cur) => {
      pre[cur.id] = { ...cur };
      return pre;
    }, {});
    this.db.knex.transaction(async (trx) => {
      const ids = Object.keys(idsAndData);
      await Promise.all(
        ids.map((id) =>
          trx.from('nhan_khau').where('id', id).update(idsAndData[id]),
        ),
      );
      return trx.from('don_dinh_chinh_nhan_khau').insert(donDinhChinhNhanKhau);
    });
  }
}
