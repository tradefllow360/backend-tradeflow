// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosModule } from './users/usuarios.module';


@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://tradefllow360_db_user:Cu5F82YvuNlYLfHh@store-mind.dqhqqgf.mongodb.net/store-mind?retryWrites=true&w=majority&appName=store-mind'), // Tu URL de MongoDB
    UsuariosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

//env pasarr
