import { Module } from '@nestjs/common';
import { PersonnelService } from './personnel.service';
import { PersonnelController } from './personnel.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Personnel, PersonnelSchema } from './model/personnel.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Personnel.name, schema: PersonnelSchema },
    ]),
  ],
  controllers: [PersonnelController],
  providers: [PersonnelService],
})
export class PersonnelModule {}
