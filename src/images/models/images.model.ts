
import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Images extends Model {
  @Column
  name: string;

  @Column
  url: string;

}
