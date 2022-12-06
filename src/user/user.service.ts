import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { userDto } from 'src/dto/user.dto';

@Injectable()
export class UserService {
  constructor( private readonly db: DatabaseService) {}
  getUserByUsename(username: string) {
    return this.db.user_table().where('username', username)
  }
  updateByUsername (username: string, payload: userDto) {
    return this.db.user_table().where('username', username).update(payload)
  }
  deleteUser(username: string) {
    return this.db.user_table().where('username', username).del()
  }
}
