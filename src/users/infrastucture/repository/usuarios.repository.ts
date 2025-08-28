// src/usuarios/infrastructure/repository/usuarios.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from '../entities/user.schema';
import { EmpresaEntity } from '../entities/empresa.schema';
import { RoleEntity } from '../entities/role.schema';
import { ClientSession } from 'mongoose';

@Injectable()
export class UsuariosRepository {
  constructor(
    @InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>,
    @InjectModel(EmpresaEntity.name) private readonly empresaModel: Model<EmpresaEntity>,
    @InjectModel(RoleEntity.name) private readonly roleModel: Model<RoleEntity>,
  ) {}

  // Métodos de la base de datos
  async findByEmailAndEmpresa(empresaId: string, email: string): Promise<UserEntity | null> {
    return this.userModel.findOne({ empresa: empresaId, email }).populate('rol').populate('empresa').exec();
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userModel.findById(id).populate('rol').populate('empresa').exec();
  }

  async create(user: Partial<UserEntity>, session?: ClientSession): Promise<UserEntity> {
 
    const newUser = new this.userModel(user);
    return newUser.save({ session });
  }

  async update(id: string, user: Partial<UserEntity>): Promise<UserEntity | null> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
     const result = await this.userModel.deleteOne({ _id: id }).exec();
     return result.deletedCount > 0;
  }

  async createEmpresaAndAdmin(empresaData: Partial<EmpresaEntity>, adminData: Partial<UserEntity>) {
    const session = await this.userModel.db.startSession();
    session.startTransaction();
    try {
      // 1. Crear el rol de Admin si no existe
      let adminRole = await this.roleModel.findOne({ nombre: 'admin' }).session(session);
      if (!adminRole) {
        adminRole = new this.roleModel({ nombre: 'admin', descripcion: 'Administrador del sistema' });
        await adminRole.save({ session });
      }

      // 2. Crear la empresa
      const newEmpresa = new this.empresaModel(empresaData);
      const savedEmpresa = await newEmpresa.save({ session });

      // 3. Crear el usuario admin
      const admin = new this.userModel({
          ...adminData,
          empresa: savedEmpresa._id,
          rol: adminRole._id
      });
      const savedAdmin = await admin.save({ session });

      await session.commitTransaction();
      
      // Populamos los datos para devolverlos completos
      savedAdmin.empresa = savedEmpresa;
      savedAdmin.rol = adminRole;
      
      return { empresa: savedEmpresa, usuario: savedAdmin };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async createRoles(roles: Partial<RoleEntity>[]): Promise<RoleEntity[]| any> {
    return this.roleModel.insertMany(roles);
  }

  async findAllRoles(): Promise<RoleEntity[]> {
    return this.roleModel.find().exec();
  }

  async findByIdRole(roleId: string): Promise<RoleEntity | null> {
    return this.roleModel.findById(roleId).exec();
  }

  async findByIdEmpresa(empresaId: string): Promise<EmpresaEntity | null> {
    return this.empresaModel.findById(empresaId).exec();
  }

}