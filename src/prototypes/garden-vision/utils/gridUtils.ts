import { DetectedItem, GridCell } from '../types';
import { GRID_CONFIG } from '../constants';

export class GridUtils {
  static generateGridData(detectedItems: DetectedItem[]): GridCell[] {
    const { SIZE: gridSize, CELL_SIZE } = GRID_CONFIG;
    const cells: GridCell[] = [];
    
    const cellWidth = CELL_SIZE.WIDTH / gridSize;
    const cellHeight = CELL_SIZE.HEIGHT / gridSize;
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cell: GridCell = {
          x: x * cellWidth,
          y: y * cellHeight,
          width: cellWidth,
          height: cellHeight
        };
        
        // Find items that intersect with this cell
        const item = this.findItemInCell(detectedItems, cell);
        if (item) {
          cell.item = item;
        }
        
        cells.push(cell);
      }
    }
    
    return cells;
  }
  
  private static findItemInCell(items: DetectedItem[], cell: GridCell): DetectedItem | undefined {
    return items.find(item => {
      const itemCenterX = item.bbox.x + item.bbox.width / 2;
      const itemCenterY = item.bbox.y + item.bbox.height / 2;
      
      return itemCenterX >= cell.x && 
             itemCenterX < cell.x + cell.width &&
             itemCenterY >= cell.y && 
             itemCenterY < cell.y + cell.height;
    });
  }
  
  static getCellBackgroundColor(cell: GridCell): string {
    if (!cell.item) return 'bg-gray-50';
    
    const alpha = Math.round((cell.item.confidence * 0.6 + 0.2) * 100);
    const baseColor = this.getColorClass(cell.item.color);
    
    return `${baseColor} opacity-${alpha}`;
  }
  
  private static getColorClass(color: string): string {
    const colorMap: Record<string, string> = {
      '#3B82F6': 'bg-blue-200',
      '#8B5CF6': 'bg-purple-200',
      '#EF4444': 'bg-red-200',
      '#F59E0B': 'bg-orange-200',
      '#10B981': 'bg-green-200'
    };
    
    return colorMap[color] || 'bg-gray-200';
  }
  
  static groupItemsByType(items: DetectedItem[]): Record<string, DetectedItem[]> {
    return items.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {} as Record<string, DetectedItem[]>);
  }
  
  static calculateGridStatistics(cells: GridCell[]): {
    totalCells: number;
    occupiedCells: number;
    occupancyRate: number;
    itemsByType: Record<string, number>;
  } {
    const totalCells = cells.length;
    const occupiedCells = cells.filter(cell => cell.item).length;
    const occupancyRate = (occupiedCells / totalCells) * 100;
    
    const itemsByType = cells.reduce((acc, cell) => {
      if (cell.item) {
        acc[cell.item.type] = (acc[cell.item.type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalCells,
      occupiedCells,
      occupancyRate,
      itemsByType
    };
  }
}