import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { DonChuyenKhauDto } from 'src/dto/donChuyenKhau.dto';
import { HokhauDto } from 'src/dto/hoKhau.dto';
import { SearchHoKhauDto } from './dto/searchHokhau.dto';
import { InputTachKhauDto } from './dto/inputTachKhau.dto';
import { pheDuyet } from '../utils';
import { DonDinhChinhHoKhauDto } from 'src/dto/donDinhChinhHoKhau.dto';
import { queryGetDonDto } from 'src/common/queryGetDon.dto';
import { DON_STATUS, reject } from 'src/common/constant';
import { InputChuyenKhauDto } from './dto/inputChuyenKhau.dto';
import { InnputDonNhapKhauDto } from './dto/inputNhapKhau.dto';
import { UserPayloadDto } from 'src/auth/dto/userPayload.dto';
import { omit } from 'lodash/fp';
import { DonTachKhauDto } from 'src/dto/donTachKhau.dto';
import { HoKhauResponseDto } from './dto/hoKhauResponse.dto';
import {
  TrackBackData,
  TrackBackDataResponse,
  TrackBackQuest,
} from 'src/common/interface';
import { table } from 'console';
@Injectable()
export class HokhauService {
  constructor(private readonly database: DatabaseService) {}
  readonly omitDonField = omit([
    'id',
    'trang_thai',
    'user_phe_duyet',
    'ngay_phe_duyet',
  ]);
  async trackBachHoKhau(id: number, query: TrackBackQuest) {
    const { startDate, endDate } = query;
    const getDon = (table: string, col: string, option = {}) => {
      const { alterDes } = option as any;
      return this.database.knex
        .from(table)
        .where(col, id)
        .whereBetween('ngay_phe_duyet', [
          new Date(startDate),
          new Date(endDate),
        ])
        .where({ trang_thai: DON_STATUS.PHE_DUYET })
        .then((dons) =>
          dons.map((don) => {
            const type = table;
            const manipulateDon = don as DonDinhChinhHoKhauDto;
            const date = manipulateDon.ngay_phe_duyet;
            const jsonString = alterDes
              ? manipulateDon[alterDes]
              : manipulateDon.mo_ta;
            const { cu, moi } = jsonString
              ? JSON.parse(jsonString)
              : ({} as any);
            return {
              type,
              date,
              cu,
              moi,
            };
          }),
        ) as Promise<TrackBackData<HoKhauResponseDto>>;
    };
    const data = await Promise.all([
      getDon('don_dinh_chinh_so_ho_khau', 'so_ho_khau_id'),
      getDon('don_nhap_khau', 'so_ho_khau_moi_id'),
      getDon('don_tach_khau', 'so_ho_khau_cu'),
      getDon('don_chuyen_khau', 'so_ho_khau_cu'),
      getDon('don_chuyen_khau', 'so_ho_khau_moi', { alterDes: 'mo_ta_2' }),
    ]);
    return data.flat();
  }
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

  public async timHoKhau(query: SearchHoKhauDto) {
    let { cccd, tenChuHo, diaChi, id } = query;
    let querySql = this.database

      .so_ho_khau_table(true)
      .select(
        'shk.*',
        this.database.knex.raw(`concat(nk.ho,nk.ten_dem,nk.ten) As ten_chu_ho`),
      )
      .innerJoin('nhan_khau AS nk', 'nk.id', 'shk.chu_ho_id');
    if (id) {
      if (!Array.isArray(id)) id = [id];
      querySql = querySql.whereIn('shk.id', id);
    }
    if (cccd) querySql = querySql.where('chu_ho_id', cccd);
    if (tenChuHo)
      querySql = querySql.where('ten_chu_ho', 'LIKE', `%${tenChuHo}%`);
    if (diaChi) querySql = querySql.whereILike('dia_chi', `%${diaChi}%`);
    const result = (await querySql).map(async (value) => {
      value['nhanKhau'] = await (
        await this.database
          .nhan_khau_so_ho_khau_table()
          .where('so_ho_khau_id', value.id)
          .select('nhan_khau_id')
      ).map((value) => value['nhan_khau_id']);
      return value;
    });
    return Promise.all(result);
  }

  async rejectChuyenKhau(user: UserPayloadDto, id: number) {
    const [don] = (await this.database
      .don_chuyen_khau_table()
      .where({ id, trang_thai: DON_STATUS.TAO_MOI })) as DonChuyenKhauDto[];
    if (!don) throw new NotFoundException('Khong tim thay don');
    return this.database
      .don_chuyen_khau_table()
      .where({ id, trang_thai: DON_STATUS.TAO_MOI })
      .update(reject(user));
  }

  public async chuyenKhau(inputChuyenKhau: InputChuyenKhauDto) {
    const { donChuyenKhauCung, donChuyenKhau } = inputChuyenKhau;
    const nhanKhauIds = donChuyenKhauCung.map((value) => value.nhan_khau_id);
    nhanKhauIds.push(donChuyenKhau['dai_dien_id']);
    if (
      nhanKhauIds.length !==
      (await this.database.getByIds('nhan_khau', ...nhanKhauIds)).length
    )
      throw new BadRequestException('Nhan khau khong hop le');
    const [hoKhauCu] = (await this.timHoKhau({
      id: [donChuyenKhau.so_ho_khau_cu],
    })) as HoKhauResponseDto[];
    if (!hoKhauCu) throw new BadRequestException('Ho khau khong hop le');
    nhanKhauIds.pop();
    if (nhanKhauIds.some((id) => !hoKhauCu.nhanKhau.includes(id)))
      throw new BadRequestException('Nhan khau khong hop le');

    const [hoKhauMoi] = donChuyenKhau.so_ho_khau_moi
      ? await this.database.getByIds('so_ho_khau', donChuyenKhau.so_ho_khau_moi)
      : [];
    if (donChuyenKhau.so_ho_khau_moi && !hoKhauMoi)
      throw new BadRequestException('Ho khau khong hop le');
    const normalField = this.omitDonField(donChuyenKhau);
    return this.database.knex.transaction(async (trx) => {
      const [don_chuyen_khau_id] = await this.database
        .don_chuyen_khau_table()
        .insert(normalField)
        .transacting(trx);

      await trx('don_chuyen_khau_nhan_khau').insert(
        donChuyenKhauCung.map((value) => {
          value['don_chuyen_khau_id'] = don_chuyen_khau_id;
          return value;
        }),
      );
    });
  }

  public async acceptChuyenKhau(id: number, userId: number) {
    const [[donChuyenKhau], donChuyenkhauCung] = await Promise.all([
      this.database.getByIds('don_chuyen_khau', id),
      this.database
        .don_chuyen_khau_nhan_khau_table()
        .where('don_chuyen_khau_id', id),
    ]);

    if (
      !donChuyenKhau ||
      !donChuyenkhauCung.length ||
      donChuyenKhau.trang_thai !== DON_STATUS.TAO_MOI
    )
      throw new NotFoundException('Khong ton tai don chuyen khau');
    const [hoKhauCu] = (await this.database
      .so_ho_khau_table(true)
      .where({ id: donChuyenKhau.so_ho_khau_cu })) as HokhauDto[];
    //TODO:
    const chuHoCu = await this.getChuHo(donChuyenKhau.so_ho_khau_cu);
    const nhankhausCu = await this.getNhankhaus(donChuyenKhau.so_ho_khau_cu);

    const [hoKhauMoi] = donChuyenKhau.so_ho_khau_moi
      ? await this.database
          .so_ho_khau_table(true)
          .where({ id: donChuyenKhau.so_ho_khau_moi })
      : [];
    const chuHoMoi = donChuyenKhau.so_ho_khau_moi
      ? await this.getChuHo(donChuyenKhau.so_ho_khau_moi)
      : null;
    const nhankhausMoi = donChuyenKhau.so_ho_khau_moi
      ? await this.getNhankhaus(donChuyenKhau.so_ho_khau_moi)
      : null;

    return this.database.knex.transaction(async (trx) => {
      await this.database
        .nhan_khau_so_ho_khau_table()
        .whereIn(
          'nhan_khau_id',
          donChuyenkhauCung.map((value) => value.nhan_khau_id),
        )
        .del()
        .select('dai_dien_id')
        .transacting(trx);

      const nhankhausCuMoi = await this.getNhankhaus(
        donChuyenKhau.so_ho_khau_cu,
      ).transacting(trx);
      const mo_ta_json = {
        cu: { ...hoKhauCu, ...chuHoCu, nhanKhaus: nhankhausCu },
        moi: { ...hoKhauCu, ...chuHoCu, nhanKhaus: nhankhausCuMoi },
      };

      if (!Number.isInteger(donChuyenKhau.so_ho_khau_moi))
        return await Promise.all([
          this.database
            .nhan_khau_table()
            .update({ active: false })
            .transacting(trx),
          this.database
            .editById('don_chuyen_khau', id, {
              ...pheDuyet(userId),
              mo_ta: JSON.stringify(mo_ta_json),
            })
            .transacting(trx),
        ]);

      await this.database
        .nhan_khau_so_ho_khau_table()
        .insert(
          donChuyenkhauCung.map((value) => {
            const { nhan_khau_id, quan_he_chu_ho } = value;
            return {
              nhan_khau_id,
              quan_he_chu_ho,
              so_ho_khau_id: donChuyenKhau.so_ho_khau_moi,
            };
          }),
        )
        .transacting(trx);

      const nhankhausMoiMoi = await this.getNhankhaus(
        donChuyenKhau.so_ho_khau_moi,
      ).transacting(trx);

      const mo_ta_2_json = {
        cu: { ...hoKhauMoi, ...chuHoMoi, nhanKhaus: nhankhausMoi },
        moi: { ...hoKhauMoi, ...chuHoMoi, nhanKhaus: nhankhausMoiMoi },
      };

      await this.database
        .editById('don_chuyen_khau', id, {
          ...pheDuyet(userId),
          mo_ta: JSON.stringify(mo_ta_json),
          mo_ta_2: JSON.stringify(mo_ta_2_json),
        })
        .transacting(trx);
    });
  }

  async rejectTachKhau(user: UserPayloadDto, id: number) {
    const [don] = (await this.database
      .don_tach_khau_table()
      .where({ id, trang_thai: DON_STATUS.TAO_MOI })) as DonTachKhauDto[];
    if (!don) throw new NotFoundException('Khong tim thay don');
    return this.database
      .don_tach_khau_table()
      .where({ id, trang_thai: DON_STATUS.TAO_MOI })
      .update(reject(user));
  }

  public async tachKhau(don: InputTachKhauDto) {
    const { donTachKhau, donTachKhauCung } = don;
    if (donTachKhau) {
      const { dai_dien_id, so_ho_khau_cu, dia_chi_moi } = donTachKhau;
      if (!dai_dien_id || !so_ho_khau_cu || !dia_chi_moi)
        throw new HttpException(
          `${dai_dien_id ? '' : 'Không có đại diện'}${
            so_ho_khau_cu ? '' : 'Không có hộ khẩu cũ'
          }${dia_chi_moi ? '' : 'Không có địa chỉ mới'}
          `,
          400,
        );
      const nhanKhauHoKhau = await this.database.getNhanKhauIdsHoKhau(
        so_ho_khau_cu,
      );
      if (
        !donTachKhauCung.every((value) =>
          nhanKhauHoKhau.includes(value.nhan_khau_id),
        ) ||
        !nhanKhauHoKhau.includes(donTachKhau.dai_dien_id)
      )
        throw new NotFoundException('Nhan Khau tach cung khong hop le');
      const hoKhauCu = await this.database.getByIds(
        'so_ho_khau',
        so_ho_khau_cu,
      );

      if (!hoKhauCu) throw new NotFoundException('So ho khau khong ton tai');

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
    const [donTachKhau] = (await this.database
      .getByIds('don_tach_khau', id)
      .where({ trang_thai: DON_STATUS.TAO_MOI })) as DonTachKhauDto[];
    if (!donTachKhau) throw new NotFoundException('Khong tim thay don');
    const [nhanKhaucu, [hoKhau]] = await Promise.all([
      this.getNhankhaus(donTachKhau.so_ho_khau_cu),
      this.database.so_ho_khau_table().where({ id: donTachKhau.so_ho_khau_cu }),
    ]);
    return this.database.knex.transaction(async (trx) => {
      const hoKhauMoiId = await this.database
        .so_ho_khau_table()
        .insert({
          dia_chi: donTachKhau.dia_chi_moi,
          chu_ho_id: donTachKhau.dai_dien_id,
        })
        .transacting(trx);

      const xoaChuHoTachQuery = this.database
        .nhan_khau_so_ho_khau_table()
        .where('nhan_khau_id', donTachKhau.dai_dien_id)
        .del()
        .transacting(trx);
      const nhanKhauIdsQuery = this.database
        .don_tach_khau_tach_cung_table()
        .where('don_tach_khau_id', id)
        .select('nhan_khau_id', 'quan_he')
        .transacting(trx);

      let [nhanKhauIds, xoaChuHo] = await Promise.all([
        nhanKhauIdsQuery,
        xoaChuHoTachQuery,
      ]);
      if (nhanKhauIds.length > 0) {
        let queryUpdate = this.database.nhan_khau_so_ho_khau_table();
        nhanKhauIds.forEach((value) => {
          queryUpdate = queryUpdate
            .where('nhan_khau_id', value.nhan_khau_id)
            .update({
              so_ho_khau_id: hoKhauMoiId,
              quan_he_chu_ho: value.quan_he,
            });
        });
        await queryUpdate.transacting(trx);
      }
      const nhanKhausMoi = await this.getNhankhaus(
        donTachKhau.so_ho_khau_cu,
      ).transacting(trx);
      const chuHo = this.getChuHo(donTachKhau.so_ho_khau_cu);
      const mo_ta = JSON.stringify({
        cu: { ...hoKhau, ...chuHo, nhanKhaus: nhanKhaucu },
        moi: { ...hoKhau, ...chuHo, nhanKhaus: nhanKhausMoi },
      });
      await this.database
        .editById('don_tach_khau', id, {
          ...pheDuyet(userId, note),
          so_ho_khau_moi: hoKhauMoiId,
          mo_ta,
        })
        .transacting(trx);
    });
  }

  async rejectSuakhau(user: UserPayloadDto, id: number) {
    const [don] = await this.database
      .getByIds('don_dinh_chinh_so_ho_khau', id)
      .where({ trang_thai: DON_STATUS.TAO_MOI });
    if (!don) throw new NotFoundException('Khong tim thay don');
    return this.database
      .getByIds('don_dinh_chinh_so_ho_khau', id)
      .update(reject(user));
  }

  public async suaKhau(don: DonDinhChinhHoKhauDto) {
    const [soHoKhauCu] = await this.database.getByIds(
      'so_ho_khau',
      don.so_ho_khau_id,
    );
    const changeField = JSON.parse(don.mo_ta);
    if (!soHoKhauCu) throw new NotFoundException('Khong tim thay ho khau');
    don.mo_ta = JSON.stringify(omit(['id', 'chu_ho_id'])(changeField));
    return this.database
      .don_dinh_chinh_so_ho_khau_table()
      .insert({ ...don, trang_thai: 'TAO_MOI' });
  }

  async getChuHo(id) {
    const [chuHo] = await this.database
      .so_ho_khau_table(true)
      .where('shk.id', id)
      .innerJoin('nhan_khau as nk', 'nk.id', 'shk.chu_ho_id')
      .select({
        cccd_chu_ho: 'nk.cccd',
        ten_chu_ho: this.database.knex.raw(
          `concat(nk.ho, ' ', nk.ten_dem, ' ', nk.ten)`,
        ),
      });
    return chuHo;
  }

  getNhankhaus(so_ho_khau_id) {
    return this.database
      .nhan_khau_so_ho_khau_table(true)
      .select({
        ten: this.database.knex.raw(
          `concat(nk.ho, ' ', nk.ten_dem, ' ', nk.ten)`,
        ),
        cccd: 'nk.cccd',
        id: 'nk.id',
        quan_he_chu_ho: 'nkhk.quan_he_chu_ho',
      })
      .leftJoin('nhan_khau as nk', 'nk.id', 'nkhk.nhan_khau_id')
      .where({ so_ho_khau_id });
  }

  public async acceptSuaKhau(id: number, userId: number, note?: string) {
    const [don] = await this.database.getByIds('don_dinh_chinh_so_ho_khau', id);
    if (don.trang_thai !== DON_STATUS.TAO_MOI)
      throw new BadRequestException('Đơn không hợp lệ');
    const [soHoKhauCu] = await this.database.getByIds(
      'so_ho_khau',
      don.so_ho_khau_id,
    );
    const nhanKhaus = await this.getNhankhaus(soHoKhauCu.id);
    const chuHo = await this.getChuHo(soHoKhauCu.id);
    return this.database.knex.transaction(async (trx) => {
      await this.database
        .editById('so_ho_khau', don.so_ho_khau_id, JSON.parse(don.mo_ta))
        .transacting(trx);
      const [soHoKhauMoi] = await this.database
        .getByIds('so_ho_khau', don.so_ho_khau_id)
        .transacting(trx);
      don.mo_ta = JSON.stringify({
        cu: { ...soHoKhauCu, nhanKhaus, ...chuHo },
        moi: { ...soHoKhauMoi, nhanKhaus, ...chuHo },
      });
      await this.database
        .editById('don_dinh_chinh_so_ho_khau', id, {
          ...pheDuyet(userId, note),
          mo_ta: don.mo_ta,
        })
        .transacting(trx);
    });
  }

  async rejectNhapKhau(user: UserPayloadDto, id: number) {
    const [don] = await this.database
      .getByIds('don_nhap_khau', id)
      .where({ status: DON_STATUS.TAO_MOI });
    if (!don) throw new NotFoundException('Khong tim thay don');
    return this.database.getByIds('don_nhap_khau', id).update(reject(user));
  }

  async nhapKhau(nhapKhauInput: InnputDonNhapKhauDto) {
    const { donNhapKhau, donNhapKhauCung } = nhapKhauInput;
    const { dai_dien_id, so_ho_khau_moi_id } = donNhapKhau;
    const daiDien = await this.database.getByIds('nhan_khau', dai_dien_id);
    if (!daiDien.length)
      throw new NotFoundException('Khoong tim thay nguoi dai dien');
    if (
      Number.isInteger(so_ho_khau_moi_id) &&
      !(await this.database.getByIds('so_ho_khau', so_ho_khau_moi_id)).length
    )
      throw new NotFoundException('Khong tim thay ho khau');
    const nhanKhau = await this.database.getByIds(
      'nhan_khau',
      ...donNhapKhauCung.map((value) => value.nhan_khau_id),
    );
    if (
      nhanKhau.length !== donNhapKhauCung.length ||
      (
        await this.database.nhan_khau_so_ho_khau_table().whereIn(
          'nhan_khau_id',
          donNhapKhauCung.map((value) => value.nhan_khau_id),
        )
      ).length
    )
      throw new NotFoundException('Nhan khau nhap khau cung khong hop le');
    return this.database.knex.transaction(async (trx) => {
      const [donNhapKhauId] = await this.database
        .don_nhap_khau_table()
        .insert(donNhapKhau)
        .transacting(trx);

      await this.database
        .don_nhap_khau_nhap_cung_table()
        .insert(
          donNhapKhauCung.map((value) => {
            value.don_nhap_khau_id = donNhapKhauId;
            return value;
          }),
        )
        .transacting(trx);
    });
  }

  async acceptNhapKhau(id: number, userId: number) {
    const [[donNhapKhau], donNhapKhauCung] = await this.getDonNhapKhau(id);
    if (donNhapKhau.trang_thai !== DON_STATUS.TAO_MOI)
      throw new NotFoundException('Khong tim thay');
    const nhanKhauCu = await this.getNhankhaus(donNhapKhau.so_ho_khau_moi_id);
    const chuHo = await this.getChuHo(donNhapKhau.so_ho_khau_moi_id);
    const [hokhau] = await this.database
      .so_ho_khau_table()
      .where({ id: donNhapKhau.so_ho_khau_moi_id });
    return this.database.knex.transaction(async (trx) => {
      const soHoKhau =
        donNhapKhau.so_ho_khau_moi_id === null
          ? (
              await this.database
                .so_ho_khau_table()
                .insert({
                  dia_chi: donNhapKhau.dia_chi_moi,
                  chu_ho_id: donNhapKhau.dai_dien_id,
                })
                .transacting(trx)
            )[0]
          : donNhapKhau.so_ho_khau_moi_id;

      await this.database
        .nhan_khau_so_ho_khau_table()
        .insert(
          donNhapKhauCung.map((value) => {
            const { nhan_khau_id } = value;
            return {
              nhan_khau_id,
              so_ho_khau_id: soHoKhau,
              quan_he_chu_ho: donNhapKhau.so_ho_khau_moi_id
                ? value.quan_he_chu_ho
                : value.quan_he_dai_dien,
            };
          }),
        )
        .transacting(trx);

      const nhanKhauMoi = await this.getNhankhaus(
        donNhapKhau.so_ho_khau_moi_id,
      ).transacting(trx);
      const mo_ta = JSON.stringify({
        cu: { nhanKhaus: nhanKhauCu, ...chuHo, ...hokhau },
        moi: { nhanKhaus: nhanKhauMoi, ...chuHo, ...hokhau },
      });
      const pheDuyetQuery = await this.database
        .don_nhap_khau_table()
        .where({ id })
        .update({ ...pheDuyet(userId), so_ho_khau_moi_id: soHoKhau, mo_ta })
        .transacting(trx);
    });
  }

  getDonNhapKhau(id: number) {
    return Promise.all([
      this.database.getByIds('don_nhap_khau', id),
      this.database
        .don_nhap_khau_nhap_cung_table()
        .where({ don_nhap_khau_id: id }),
    ]);
  }

  getDon(query: queryGetDonDto) {
    const limit = 5;
    const { page = 1, startDate, endDate, status, type } = query;
    let querySql = this.database
      .knex(type)
      .orderBy('ngay_lam_don', 'desc')
      .limit(limit)
      .offset(limit * (page - 1));
    if (status) querySql = querySql.where({ trang_thai: status });
    if (startDate)
      querySql = querySql.where('ngay_lam_don', '>=', new Date(startDate));
    if (endDate)
      querySql = querySql.where('ngay_lam_don', '<=', new Date(endDate));
    return querySql;
  }
}
