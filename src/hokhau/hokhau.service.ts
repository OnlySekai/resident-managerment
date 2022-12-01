import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { DonChuyenKhauDto } from 'src/dto/donChuyenKhau.dto';
import { HokhauDto } from 'src/dto/hoKhau.dto';
import { SearchHoKhauDto } from './dto/searchHokhau.dto';
import { InputTachKhauDto } from './dto/inputTachKhau.dto';

@Injectable()
export class HokhauService {
  constructor(private readonly database: DatabaseService) {}
  public themHoKhau(hokhau: HokhauDto) {
    return this.database.knex.transaction((trx) => {
      this.database
        .so_ho_khau_table()
        .insert(hokhau)
        .transacting(trx)
        .then((id) => {
          const data = {
            nhan_khau_id: hokhau.chu_ho_id,
            so_ho_khau_id: id[0],
            quan_he_chu_ho: 'chủ hộ',
          };
          return this.database
            .nhan_khau_so_ho_khau_table()
            .insert(data)
            .transacting(trx);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    });
  }

  public timHoKhau(query: SearchHoKhauDto) {
    const { cccd, tenChuHo, diaChi } = query;
    let result = this.database
      .so_ho_khau_table(true)
      .select(
        'shk.*',
        this.database.knex.raw(`concat(nk.ho,nk.ten_dem,nk.ten) As ten_chu_ho`),
      )
      .innerJoin('nhan_khau AS nk', 'nk.id', 'shk.chu_ho_id');
    if (cccd) result = result.where('chu_ho_id', cccd);
    if (tenChuHo) result = result.where('ten_chu_ho', 'LIKE', `%${tenChuHo}%`);
    if (diaChi) result = result.whereILike('dia_chi', `%${diaChi}%`);
    return result;
  }

  /*
  input = [inputChuyenKhau]
  */
  public async chuyenKhau(id: number, donChuyenKhau: DonChuyenKhauDto) {
    const nhan_khau_ids = (
      await this.database.getNhanKhauByHoKhau(id, { detail: false })
    ).map((value) => value.nhan_khau_id);
    return this.database.knex.transaction((trx) => {
      this.database
        .nhan_khau_so_ho_khau_table()
        .whereIn('nhan_khau_id', nhan_khau_ids)
        .del()
        .transacting(trx)
        .then(() => {
          return this.database.delByIds('so_ho_khau', id).transacting(trx);
        })
        .then(() => {
          return this.database
            .getByIds('nhan_khau', ...nhan_khau_ids)
            .del('id')
            .transacting(trx);
        })
        .then(() =>
          this.database.don_chuyen_khau_table
            .insert(donChuyenKhau)
            .transacting(trx),
        )
        .then(trx.commit)
        .catch(trx.rollback);
    });
  }

  public async tachKhau(don: InputTachKhauDto) {
    const { donTachKhau, donTachKhauCung } = don;
    if (donTachKhau) {
      const { chu_ho_id, so_ho_khau_cu, dia_chi_moi } = donTachKhau;
      if (!chu_ho_id || !so_ho_khau_cu || !dia_chi_moi)
        throw new HttpException(
          `${chu_ho_id ? '' : 'Không có chủ hô'}\n${
            so_ho_khau_cu ? '' : 'Không có hộ khẩu cũ'
          }\n${dia_chi_moi ? '' : 'Không có địa chỉ mới'}
          }`,
          400,
        );
      await this.database.knex.transaction((trx) => {
        this.database
          .so_ho_khau_table()
          .insert({ dia_chi: dia_chi_moi, chu_ho_id }, 'id')
          .transacting(trx)
          .then((ho_khau_id) => {
            return this.database
              .nhan_khau_so_ho_khau_table()
              .where('nhan_khau_id', chu_ho_id)
              .update({ so_ho_khau_id: ho_khau_id, quan_he_chu_ho: 'Chủ hộ' })
              .transacting(trx)
              .then(() => {
                return this.database
                  .don_tach_khau_table()
                  .insert({ ...donTachKhau, so_ho_khau_moi: ho_khau_id })
                  .transacting(trx);
              });
          })
          .then(trx.commit)
          .catch(trx.rollback);
      });
    }
  }
}
