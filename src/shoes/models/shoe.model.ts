import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Image } from 'src/images/models/images.model';

@Table
export class Shoe extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  key: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nome: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  preco: number;

  @HasMany(() => Image) // Define a relação com o modelo Image
  imagens: Image[];

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: false,
  })
  tamanhos: number[];
}
