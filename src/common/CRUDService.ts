import { PrismaService } from 'nestjs-prisma';
import { ModifiersType } from './types';
import { validateSortingQuery } from './utils/validateSortingQuery';

type CreateDto<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export class CRUDService<T> {
  protected prismaService = new PrismaService();
  constructor(private readonly model: string) {}

  async create(data: CreateDto<T>, include?: any): Promise<T> {
    return await this.prismaService[this.model].create({ data, ...include });
  }

  async findAll(
    modifiers: ModifiersType,
  ): Promise<{ totalRows: number; data: T[] }> {
    const { skip, take, sort, include, where } = modifiers;
    let orderBy = undefined;
    if (sort) {
      validateSortingQuery(sort);
      const [fieldName, order] = sort.split('-');
      orderBy = fieldName && order && { [fieldName]: order };
    }

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService[this.model].findMany({
        include,
        where,
        skip,
        take,
        orderBy,
      }),
      this.prismaService[this.model].count({ where }),
    ]);

    return {
      totalRows: count,
      data,
    };
  }

  async update(where: any, data: Partial<T>, include?: any): Promise<T> {
    return await this.prismaService[this.model].update({
      where,
      data,
      ...include,
    });
  }

  async findOne(where: any, include?: any): Promise<T> {
    return await this.prismaService[this.model].findUniqueOrThrow({
      where,
      include,
    });
  }

  async delete(where: any): Promise<T> {
    return await this.prismaService[this.model].delete({ where });
  }
}