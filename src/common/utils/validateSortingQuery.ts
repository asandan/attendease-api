import { BadRequestException } from '@nestjs/common';

export const validateSortingQuery = (sort: string) => {
  const [fieldName, order] = sort ? sort.split('-') : [];
  if (!fieldName || !order) {
    throw new BadRequestException(
      'Invalid sorting query type. Must be: field-order',
    );
  }
  if (order && order !== 'asc' && order !== 'desc') {
    throw new BadRequestException('Sorting order can only be asc or desc');
  }
};