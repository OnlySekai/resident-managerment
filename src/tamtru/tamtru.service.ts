import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { DonTamTruDto } from 'src/dto/donTamTru.dto';
import { nhanKhauDto } from 'src/dto/nhanKhau.dto';

@Injectable()
export class TamtruService {
  constructor(private readonly db: DatabaseService) {}
  themTamTru(nhanKhau: nhanKhauDto, don: DonTamTruDto) {
    return this.db.knex.transaction((trx) => {
      return (
        this.db
          .nhan_khau_so_ho_khau_table()
          //TODO: check nhan khau ton tai chua, chua thi moi insert, co roi thi update status
          .insert(nhanKhau)
          .transacting(trx)
          .then((ids) => {
            const id = ids[0];
            return this.db
              .don_tam_tru_table()
              .insert({ ...don, nhan_khau_id: id })
              .transacting(trx);
          })
          .then(trx.commit)
          .catch(trx.rollback)
      );
    });
  }
}
