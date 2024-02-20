import { PrismaClient, Prisma } from '@prisma/client';

type PrismaOption = PrismaClient<Prisma.PrismaClientOptions, never>;

export type PrismaModel =
   keyof Omit<
      PrismaOption,
      | '$connect'
      | '$disconnect'
      | '$executeRaw'
      | '$executeRawUnsafe'
      | '$on'
      | '$queryRaw'
      | '$queryRawUnsafe'
      | '$transaction'
      | '$use'
      | '$extends'
      | symbol
    >
  | 'ep';

export type Payload<Z> = Omit<Z, 'id'>[];

/**
 * 
 * @param prisma - PrismaClient instance
 * @param payload - An array of payload
 * @param model - A model name (DON'T USE 'ep', USE 'eP' INSTEAD)
 */
const addItems = async <T>(
  prisma: PrismaClient,
  payload: Payload<T>,
  model: PrismaModel,
) => {
  await Promise.allSettled(
    payload.map(async (el) => {
      try {
        await prisma[model].create({
          data: el,
        });
      } catch (e) {
        console.log(e);
      }
    }),
  );
};

export default addItems;
