import { ColumnType } from '../types';

export const mapClickUpStatusToColumn = (status: string): ColumnType => {
  const statusMap: Record<string, ColumnType> = {
    'backlog': 'backlog',
    'sprint': 'sprint',
    'em andamento': 'em_andamento',
    'em aprovação': 'em_aprovacao',
    'finalizada': 'finalizada'
  };
  
  return statusMap[status.toLowerCase()] || 'backlog';
};

export const mapColumnToClickUpStatus = (column: ColumnType): string => {
  const columnMap: Record<ColumnType, string> = {
    'backlog': 'Backlog',
    'sprint': 'Sprint',
    'em_andamento': 'Em Andamento',
    'em_aprovacao': 'Em Aprovação',
    'finalizada': 'Finalizada'
  };
  
  return columnMap[column];
};