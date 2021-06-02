import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/Schema/Notification.entity';
import { Return } from 'src/utils/Returnfunctions';
import { IReturnObject } from 'src/utils/ReturnObject';
import { Repository } from 'typeorm';

@Injectable()
export class UserNotiService {
  constructor(
    @InjectRepository(Notification) private notiRepo: Repository<Notification>,
  ) {}

  async sendUserNot(user_id: string, message: string): Promise<IReturnObject> {
    try {
      // create notification
      const noti = await this.notiRepo.save({ user_id, message, admin: false });
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Notification sent',
        data: noti,
      });
    } catch (error) {
      return Return({
        error: true,
        statusCode: 500,
        errorMessage: 'Internal Server error',
        trace: error,
      });
    }
  }

  async sendadminNot(message: string): Promise<IReturnObject> {
    try {
      // create notification
      const noti = await this.notiRepo.save({ message, admin: true });
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Notification sent',
        data: noti,
      });
    } catch (error) {
      return Return({
        error: true,
        statusCode: 500,
        errorMessage: 'Internal Server error',
        trace: error,
      });
    }
  }

  async getAdminNot(): Promise<IReturnObject> {
    try {
      const noti = await this.notiRepo.find({ where: { admin: true } });
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Notification',
        data: noti,
      });
    } catch (error) {
      return Return({
        error: true,
        statusCode: 500,
        errorMessage: 'Internal Server error',
        trace: error,
      });
    }
  }

  async getUserNot(user_id: string): Promise<IReturnObject> {
    try {
      const noti = await this.notiRepo.find({ where: { user_id } });
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Notification',
        data: noti,
      });
    } catch (error) {
      return Return({
        error: true,
        statusCode: 500,
        errorMessage: 'Internal Server error',
        trace: error,
      });
    }
  }

  async getsingleNot(id: string): Promise<IReturnObject> {
    try {
      const noti = await this.notiRepo.find({ where: { id } });
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'Notification',
        data: noti,
      });
    } catch (error) {
      return Return({
        error: true,
        statusCode: 500,
        errorMessage: 'Internal Server error',
        trace: error,
      });
    }
  }

  async markasRead(id: string): Promise<IReturnObject> {
    try {
      const noti = await this.notiRepo.findOne({ where: { id } });
      if (noti === undefined) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Not found',
        });
      }

      // mark as read
      const read = await this.notiRepo
        .createQueryBuilder()
        .update()
        .set({ read: true })
        .where({ id })
        .execute();
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'read',
      });
    } catch (error) {
      return Return({
        error: true,
        statusCode: 500,
        errorMessage: 'Internal Server error',
        trace: error,
      });
    }
  }

  async del(id: string): Promise<IReturnObject> {
    try {
      const noti = await this.notiRepo.findOne({ where: { id } });
      if (noti === undefined) {
        return Return({
          error: true,
          statusCode: 400,
          errorMessage: 'Not found',
        });
      }

      // mark as read
      const read = await this.notiRepo
        .createQueryBuilder()
        .delete()
        .where({ id })
        .execute();
      return Return({
        error: false,
        statusCode: 200,
        successMessage: 'deleted',
      });
    } catch (error) {
      return Return({
        error: true,
        statusCode: 500,
        errorMessage: 'Internal Server error',
        trace: error,
      });
    }
  }
}
