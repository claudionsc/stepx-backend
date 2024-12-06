import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Shoe } from 'src/shoes/models/shoe.model';

@Table
export class Image extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;

  @ForeignKey(() => Shoe) // Chave estrangeira que referencia o modelo Shoe
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  shoeId: number;

  @BelongsTo(() => Shoe) // Define a relação com o modelo Shoe
  shoe: Shoe;
}
