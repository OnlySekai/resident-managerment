import { Injectable, NotFoundException } from '@nestjs/common';
import { UserPayloadDto } from 'src/auth/dto/userPayload.dto';
import { DON_STATUS, reject } from 'src/common/constant';
import { DatabaseService } from 'src/database.service';
import { DonTamTruDto } from 'src/dto/donTamTru.dto';
import { nhanKhauDto } from 'src/dto/nhanKhau.dto';
import { pheDuyet } from 'src/utils';

@Injectable()
export class TamtruService {
  constructor(private readonly db: DatabaseService) {}
  async rejectTamTru(user: UserPayloadDto, id: number) {
    const [don] = await this.db
      .getByIds('don_tam_tru', id)
      .where({ trang_thai: DON_STATUS.TAO_MOI });
    if (!don) throw new NotFoundException('Khong tim thay don');
    return this.db.getByIds('don_tam_tru', id).update(reject(user));
  }
  themTamTru(nhanKhau: nhanKhauDto, don: DonTamTruDto) {
    return this.db.knex.transaction(async (trx) => {
      const [nhanKhauExsist] = await this.db
        .nhan_khau_table()
        .where('cccd', nhanKhau.cccd);

      if (!nhanKhauExsist) {
        const [ids] = await this.db
          .nhan_khau_table()
          .insert({ ...nhanKhau, active: false })
          .transacting(trx);

        await this.db
          .don_tam_tru_table()
          .insert({ ...don, nhan_khau_id: ids })
          .transacting(trx);
      } else {
        await this.db
          .don_tam_tru_table()
          .insert({ ...don, nhan_khau_id: nhanKhauExsist.id })
          .transacting(trx);
        await this.db
          .editById('nhan_khau', nhanKhauExsist.id, {
            ...nhanKhau,
            active: false,
          })
          .transacting(trx);
      }
    });
  }
  //Check trâng thái đơn
  async acceptTamTru(id: number, userAccept: number, note?: string) {
    const [donTamTru] = await this.db
      .getByIds('don_tam_tru', id)
      .where({ trang_thai: DON_STATUS.TAO_MOI });
    if (!donTamTru) throw new NotFoundException('Khong tim thay tam tru');
    return this.db.knex.transaction(async (trx) => {
      await Promise.all([
        this.db.editById('don_tam_tru', id, pheDuyet(userAccept)),
        this.db.editById('nhan_khau', donTamTru.nhan_khau_id, { active: true }),
      ]);
    });
  }
}
