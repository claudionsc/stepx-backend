import { Column, HasMany, Model, Table } from 'sequelize-typescript'
import { Images } from 'src/images/models/images.model';

@Table
export class Shoe extends Model {
    @Column
    key: string;

    @Column
    id: number;

    @Column
    name: string;

    @Column
    preco: number;

    @Column
    tamanhos: Array<Number>;

    @HasMany(() => Images)
    img: Images[];
}