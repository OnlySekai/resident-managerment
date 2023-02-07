import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DON_STATUS } from 'src/common/constant';
import { DatabaseService } from 'src/database.service';
import { DonTamVangDto } from 'src/dto/donTamVang.dto';
import { pheDuyet } from 'src/utils';

@Injectable()
export class TamvangService {
  constructor(private readonly db: DatabaseService) {}
  async themTamVang(don: DonTamVangDto) {
    const { nhan_khau_id } = don;
    const [nhanKhau] = await this.db.getByIds('nhan_khau', nhan_khau_id);
    if (!nhanKhau) throw new NotFoundException('Khong tim thay nhan khau');
    return this.db.don_tam_vang_table().insert(don);
  }

  async acceptTamVang(id: number, userId: number, note?) {
    const [don] = await this.db
      .getByIds('don_tam_vang', id)
      .where({ trang_thai: DON_STATUS.TAO_MOI });
    if (!don) throw new BadRequestException('Don Tam Vang Khong Ton Tai');
    console.log(don.nhan_khau_id);
    return this.db.knex.transaction(async (trx) => {
      await Promise.all([
        this.db
          .getByIds('nhan_khau', don.nhan_khau_id)
          .update({ active: false })
          .transacting(trx),
        this.db
          .editById('don_tam_vang', id, pheDuyet(userId, note))
          .transacting(trx),
      ]);
    });
  }
}
