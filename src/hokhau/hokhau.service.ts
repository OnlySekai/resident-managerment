import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { DonChuyenKhauDto } from 'src/dto/donChuyenKhau.dto';
import { HokhauDto } from 'src/dto/hoKhau.dto';
import { SearchHoKhauDto } from './dto/searchHokhau.dto';
import { InputTachKhauDto } from './dto/inputTachKhau.dto';
import { pheDuyet } from '../utils';
import { NhankhauController } from 'src/nhankhau/nhankhau.controller';
import { DonDinhChinhHoKhauDto } from 'src/dto/donDinhChinhHoKhau.dto';

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

  public async chuyenKhau(donChuyenKhau: DonChuyenKhauDto) {
    // const nhan_khau_ids = (
    //   await this.database.getNhanKhauByHoKhau(id, { detail: false })
    // ).map((value) => value.nhan_khau_id);
    return this.database.don_chuyen_khau_table().insert(donChuyenKhau);
  }

  public async acceptChuyenKhau(id: number) {
    return this.database.knex.transaction(async (trx) => {
      const changeStatus = this.database
        .editById('don_chuyen_khau', id, { trang_thai: 'PHE_DUYET' })
        .transacting(trx);
      const getNhanKhauId = this.database
        .getByIds('don_chuyen_khau', id)
        .select('dai_dien_id')
        .transacting(trx);
      const rs = await Promise.all([getNhanKhauId, changeStatus]);
      console.log(rs);
      const idNhanKhau = rs[0][0].dai_dien_id;
      const unActiveNhanKhau = this.database
        .editById('nhan_khau', idNhanKhau, {
          isActive: false,
        })
        .transacting(trx);
      const deleteOutNhanKhauHoKhau = this.database
        .nhan_khau_so_ho_khau_table()
        .where('nhan_khau_id', idNhanKhau)
        .del()
        .transacting(trx);
      await Promise.all([unActiveNhanKhau, deleteOutNhanKhauHoKhau]);
    });
  }

  public tachKhau(don: InputTachKhauDto) {
    const { donTachKhau, donTachKhauCung } = don;
    if (donTachKhau) {
      const { chu_ho_id, so_ho_khau_cu, dia_chi_moi } = donTachKhau;
      if (!chu_ho_id || !so_ho_khau_cu || !dia_chi_moi)
        throw new HttpException(
          `${chu_ho_id ? '' : 'Không có chủ hô'}${
            so_ho_khau_cu ? '' : 'Không có hộ khẩu cũ'
          }${dia_chi_moi ? '' : 'Không có địa chỉ mới'}
          `,
          400,
        );
      return this.database.knex.transaction(async (trx) => {
        const insertTachKhau = await this.database
          .don_tach_khau_table()
          .insert(donTachKhau)
          .transacting(trx);
        const newDonTachKhauCung = donTachKhauCung.map((value) => {
          return {
            ...value,
            don_tach_khau_id: insertTachKhau[0],
          };
        });
        const insertTachKhauCung =
          donTachKhauCung.length > 0
            ? await this.database
                .don_tach_khau_tach_cung_table()
                .insert(newDonTachKhauCung)
                .transacting(trx)
            : {};
      });
    }
  }

  public async acceptTachKhau(id: number, userId: number, note?: string) {
    return this.database.knex.transaction(async (trx) => {
      const acceptTachKhauQuery = this.database
        .editById('don_tach_khau', id, {
          ...pheDuyet(userId, note),
        })
        .transacting(trx);
      const hoKhauMoiQuery = this.database
        .getByIds('don_tach_khau', id)
        .select('so_ho_khau_moi')
        .transacting(trx);
      const nhanKhauIdsQuery = this.database
        .don_tach_khau_tach_cung_table()
        .where('don_tach_khau_id', id)
        .select('nhan_khau_id', 'quan_he')
        .transacting(trx);
      let [nhanKhauIds, hoKhauMoi, acceptTachKhau] = await Promise.all([
        nhanKhauIdsQuery,
        hoKhauMoiQuery,
        acceptTachKhauQuery,
      ]);
      hoKhauMoi = hoKhauMoi[0].so_ho_khau_moi;
      if (nhanKhauIds.length > 0) {
        let queryUpdate = this.database.nhan_khau_so_ho_khau_table();
        nhanKhauIds.forEach((value) => {
          queryUpdate = queryUpdate
            .where('nhan_khau_id', value.nhan_khau_id)
            .update({
              so_ho_khau_id: hoKhauMoi,
              quan_he_chu_ho: value.quan_he,
            });
        });
        await queryUpdate.transacting(trx);
      }
    });
  }
  //TODO: them sua khau accept sua khau
  public async suaKhau(don: DonDinhChinhHoKhauDto) {

  }
  public async acceptSuaKhau(id: number, userId: number, note?: string){

  }
}
