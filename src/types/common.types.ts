// Shared enums and base types

export type SortDirection = 'asc' | 'desc';

export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}
