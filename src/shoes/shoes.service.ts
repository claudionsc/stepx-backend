import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Shoe } from "./models/shoe.model";
import { Image } from "src/images/models/images.model";
import { Sequelize } from "sequelize-typescript";
import { ShoeDTO } from "./DTO/shoes";
import { ShoeList } from "./mock/shoe.mock";

// Seeder para inicialização de dados
@Injectable()
export class ShoeSeeder {
    constructor(
        @InjectModel(Shoe) private readonly shoeModel: typeof Shoe,
        @InjectModel(Image) private readonly imageModel: typeof Image,
        private readonly sequelize: Sequelize
    ) { }

    async seedDatabase(shoeList: ShoeDTO[]): Promise<void> {
        try {
            await this.sequelize.transaction(async (t) => {
                const transactionHost = { transaction: t };
    
                // Mapeia os dados de sapatos e imagens em arrays
                const shoeRecords = shoeList.map(shoe => ({
                    key: shoe.key,
                    nome: shoe.nome,
                    preco: shoe.preco,
                    tamanhos: shoe.tamanhos,
                }));
    
                // Cria todos os sapatos em uma única chamada
                const createdShoes = await this.shoeModel.bulkCreate(shoeRecords, {
                    ...transactionHost,
                    returning: true, // Para retornar os sapatos criados com os IDs
                });
    
                // Cria as imagens correspondentes a partir dos sapatos criados
                const imageRecords = [];
                createdShoes.forEach((shoe, index) => {
                    const images = shoeList[index].img; // Recupera as imagens do sapato correspondente
                    if (images) {
                        imageRecords.push(
                            { url: images.img01, shoeId: shoe.id },
                            { url: images.img02, shoeId: shoe.id },
                            { url: images.img03, shoeId: shoe.id },
                            { url: images.img04, shoeId: shoe.id }
                        );
                    }
                });
    
                // Insere todas as imagens em uma única chamada
                await this.imageModel.bulkCreate(imageRecords, transactionHost);
            });
        } catch (err) {
            console.error('Erro ao criar os dados:', err);
        }
    }
    

}

// Dividindo as responsabilidades da class em criação e consulta

// Consulta
@Injectable()
export class ShoesQueryService {

    constructor(
        @InjectModel(Shoe) private readonly shoeModel: typeof Shoe, // Modelo Shoe
    ) { }

    async findAll(): Promise<Shoe[]> {
        return this.shoeModel.findAll({
            include: [
                {
                    model: Image,  // Relacionamento com o modelo Image
                    required: false,
                },
            ],
        });
    }


    findOne(id: number): Promise<Shoe> {
        return this.shoeModel.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: Image,
                    required: false,
                },
            ],
        });
    }
}

// Criação
@Injectable()
export class ShoesCommandService implements OnModuleInit {

    constructor(
        @InjectModel(Shoe) private readonly shoeModel: typeof Shoe, // Modelo Shoe
        @InjectModel(Shoe) private readonly imageModel: typeof Image, // Modelo Shoe
        private readonly sequelize: Sequelize
    ) { }

    create(ShoeDTO: ShoeDTO): Promise<Shoe> {
        return this.shoeModel.create({
            key: ShoeDTO.key,
            nome: ShoeDTO.nome,
            preco: ShoeDTO.preco,
            img: ShoeDTO.img,
            tamanhos: ShoeDTO.tamanhos
        })
    }


    async onModuleInit() {
        // Verificar se existem dados na tabela e, caso não existam, criar
        const count = await this.shoeModel.count(); // Conta os registros
        if (count === 0) {
            console.log('Inicializando dados padrão...');
            const shoeSeeder = new ShoeSeeder(Shoe, Image, this.sequelize);
            await shoeSeeder.seedDatabase(ShoeList); // Executa a criação de dados
        } else {
            console.log('Dados já existentes no banco.');
        }
    }

}
