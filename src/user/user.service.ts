import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { UserPayloadDto } from 'src/auth/dto/userPayload.dto';
import { DatabaseService } from 'src/database.service';
import { userDto } from 'src/dto/user.dto';
import { Role } from 'src/model/role.enum';
import { selfUpdateUserDto } from './dto/selfUpdateUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}
  async getAllUser() {
    const data = await this.db.user_table();
    return data.map((value) => {
      const { hash, ...restData } = value;
      return restData;
    });
  }
  getUserByUsename(username: string) {
    return this.db.user_table().where('username', username);
  }
  updateByUsername(username: string, payload: userDto) {
    return this.db.user_table().where('username', username).update(payload);
  }
  
  async updateUser(user: UserPayloadDto, payload: selfUpdateUserDto) {
    const { userId, repassword, password: hash, ...restData } = payload;
    const [getUser] = (await this.db.getByIds(
      'user',
      userId || user.sub,
    )) as userDto[];
    if (!getUser) throw new NotFoundException('Khong ton tai user');
    if (user.roles === Role.Admin)
      return await this.db.getByIds('user', userId).update(restData);
    if (hash && getUser.hash !== repassword)
      throw new UnauthorizedException('Password sai');
    return await this.db.getByIds('user', userId).update(restData);
  }

  deleteUser(username: string) {
    return this.db.user_table().where('username', username).del();
  }
  acceptUser(id: number, acceptUser?) {
    return this.db
      .getByIds('user', id)
      .update({ trang_thai: 'PHE_DUYET', user_phe_duyet: acceptUser });
  }
  createUser(username, password) {
    const hash = password;
    return this.db.user_table().insert({ username, hash });
  }
}
