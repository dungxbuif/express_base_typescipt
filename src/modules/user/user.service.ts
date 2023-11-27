import AppDatabase from '../../core/database';
import { PrismaClient, User } from '@prisma/client';
class UserService {
   private _repository;
   constructor() {
      this._repository = AppDatabase.instance<PrismaClient>().user;
   }

   async getAll(): Promise<User[]> {
      return this._repository.findMany();
   }

   create(): Promise<User> {
      return this._repository.create({
         data: {
            email: 'dung.buihuu@ncc.asia',
            name: 'Dung Bui Huu',
         },
      });
   }
}

export default UserService;
