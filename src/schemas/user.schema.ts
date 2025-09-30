import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from './role.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'Role' })
  role: Types.ObjectId | Role;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop({default: 0})
  taskAssignedCount: number;

  @Prop({default: 0})
  leadAssignedCount: number;

  @Prop({default: "active"})
  status: string;

}

export const UserSchema = SchemaFactory.createForClass(User);