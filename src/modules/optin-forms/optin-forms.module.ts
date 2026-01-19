import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OptinFormsService } from './optin-forms.service';
import { OptinFormsController } from './optin-forms.controller';
import { OptinForm, OptinFormSchema } from 'src/schemas/optin-form.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OptinForm.name, schema: OptinFormSchema }]),
    AuthModule,
  ],
  controllers: [OptinFormsController],
  providers: [OptinFormsService],
})
export class OptinFormsModule {}