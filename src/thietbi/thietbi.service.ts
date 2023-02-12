import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { CreateThietbiDto } from './dto/create-thietbi.dto';
import { MuonDto } from './dto/muon.dto';
import { TraDto } from './dto/tra.dto';
import { Role } from 'src/model/role.enum';
import { CreateThietbiTypeDto } from './dto/create-thietbi-type.dto';
import { getIds, THIET_BI_STATUS } from 'src/common/constant';
import { omit } from 'lodash/fp';
@Injectable()
export class ThietbiService {
  constructor(private readonly db: DatabaseService) {}
  readonly omitField = omit(['name', 'id']);
  getTaiNguyenType(condition?: any) {
    let { id, name } = condition;
    const normalCondition = this.omitField(condition);
    let query = this.db.tai_nguyen_type_table().where(normalCondition);
    if (id && !Array.isArray(id)) {
      id = [id];
    }
    if (id) query = query.whereIn('id', id);
    if (name) query = query.whereILike('name', `%${name}%`);
    return query;
  }

  getTaiNguyen(condition?: any) {
    const normalCondition = this.omitField(condition);
    let query = this.db
      .tai_nguyen_table(true)
      .select('ltn.*', 'tn.*')
      .leftJoin('loai_tai_nguyen as ltn', 'loai_id', 'ltn.id')
      .where(normalCondition);
    let { id, name } = condition;
    if (id && !Array.isArray(id)) {
      id = [id];
    }
    if (id) query = query.whereIn('tn.id', id);
    if (name) query = query.whereILike('name', `%${name}%`);
    return query;
  }

  async getPhieuMuon(query: CreateThietbiDto) {
    const { id, ...restQuery } = query;
    const ids = getIds(id);
    let listPhieuMuon = this.db.phieu_muon_table().where(restQuery);
    if (ids) listPhieuMuon = listPhieuMuon.whereIn('id', ids);
    const rs = await listPhieuMuon;
    return rs.map(async (phieuMuon) => {
      phieuMuon['phien_su_dung'] = await this.db
        .phien_su_dung_table(true)
        .select('psd.*')
        .select({ ten: 'ltn.name' })
        .where({ phieu_muon: phieuMuon.id })
        .leftJoin('tai_nguyen as tn', 'tn.id', 'psd.tai_nguyen_id')
        .leftJoin('loai_tai_nguyen as ltn', 'ltn.id', 'loai_id');
      return phieuMuon;
    });
  }

  async createThietbi(createThietbi: CreateThietbiDto, roles: string[]) {
    const [type] = await this.db.getByIds(
      'loai_tai_nguyen',
      createThietbi.loai_id,
    );
    if (!type) throw new NotFoundException('Khong tim thay kieu tai nguyen');
    if (type.la_cong_trinh && !roles.includes(Role.Admin))
      throw new ForbiddenException('Khong co quyen tao cong trinh');
    return this.db.tai_nguyen_table().insert(createThietbi);
  }

  createTaiNguyenType(createTaiNguyenType: CreateThietbiTypeDto) {
    return this.db.tai_nguyen_type_table().insert(createTaiNguyenType);
  }

  muonThietBi(phieuMuon: MuonDto, userId: number) {
    console.log(phieuMuon.saoKe);
    return this.db.knex.transaction(async (trx) => {
      const [saoKeId] = await trx('sao_ke').insert({
        ...phieuMuon.saoKe,
        user_thu: userId,
      });
      const [phieuMuonId] = await trx('phieu_muon').insert({
        ...phieuMuon.phieuMuon,
        trang_thai: 'CREATE',
        sao_ke_dang_ki: saoKeId,
        user_tao: userId,
      });
      let phienSuDungIds = trx('phien_su_dung');
      phieuMuon.phienSuDung.forEach(
        (value) =>
          (phienSuDungIds = phienSuDungIds.insert({
            ...value,
            phieu_muon: phieuMuonId,
          })),
      );
      await phienSuDungIds;
    });
  }

  async traThietBi(phieuTra: TraDto) {
    const [phieuMuon] = await this.db.getByIds(
      'phieu_muon',
      phieuTra.phieuMuonId,
    );
    if (
      phieuMuon ||
      [THIET_BI_STATUS.DONE, THIET_BI_STATUS.MISSING].includes(
        phieuMuon.trang_thai,
      )
    )
      throw new NotFoundException('Khong tim thay phieu muon');
    const tainguyenId = await this.db
      .phien_su_dung_table()
      .select('tai_nguyen_id')
      .where('phieu_muon', phieuTra.phieuMuonId);

    return this.db.knex.transaction(async (trx) => {
      const [idSaoKeTra] = await this.db
        .sao_ke_table()
        .insert(phieuTra.saoKe)
        .transacting(trx);

      const updateNgayTra = trx('phien_su_dung')
        .whereIn(
          'tai_nguyen_id',
          tainguyenId.map((value) => value.tai_nguyen_id),
        )
        .update({ ngay_tra: phieuTra.ngayTra });

      const updateXuongCap = [];
      phieuTra.note.forEach((value) => {
        const { mo_ta, tinh_trang } = value;
        const updateXuongCapQuery = this.db
          .tai_nguyen_table()
          .where({ id: value.taiNguyenId })
          .update({ mo_ta, tinh_trang })
          .transacting(trx);
        const updateXuongCapPhienQuery = this.db
          .phien_su_dung_table()
          .where({
            tai_nguyen_id: value.taiNguyenId,
            phieu_muon: phieuTra.phieuMuonId,
          })
          .update({ mo_ta: JSON.stringify({ moi: { mo_ta, tinh_trang } }) })
          .transacting(trx);
        updateXuongCap.push(updateXuongCapQuery, updateXuongCapPhienQuery);
      });

      const updatePhieuMuon = this.db.editById(
        'phieu_muon',
        phieuTra.phieuMuonId,
        {
          sao_ke_tra: idSaoKeTra,
          trang_thai: phieuTra.note.some((value) => value.tinh_trang === 0)
            ? THIET_BI_STATUS.MISSING
            : THIET_BI_STATUS.DONE,
        },
      );
      await Promise.all([...updateXuongCap, updatePhieuMuon, updateNgayTra]);
    });
  }

  async findAllTaiNguyenKhaDung({ type, startDate, endDate, all }) {
    if (all)
      return this.db
        .tai_nguyen_table(true)
        .select('tn.*')
        .select({ ten_tai_nguyen: 'ltn.name' })
        .where({ loai_id: type })
        .leftJoin('loai_tai_nguyen as ltn', 'loai_id', 'ltn.id');
    return this.db
      .tai_nguyen_table(true)
      .leftJoin('loai_tai_nguyen as ltn', 'loai_id', 'ltn.id')
      .select('tn.*')
      .select({ ten_tai_nguyen: 'ltn.name' })
      .where('loai_id', type)
      .whereNotIn('tn.id', (dangSuDung) =>
        dangSuDung
          .from('phien_su_dung')
          .select('tai_nguyen_id')
          .where('ngay_tra', null)
          .where((whereDate) =>
            whereDate
              .whereBetween('ngay_muon', [startDate, endDate])
              .orWhereBetween('ngay_hen_tra', [startDate, endDate]),
          ),
      );
  }
}
