class Cell {

    public _x: number;
    public _y: number;
    public _element: Element;
    public _maxX: number;
    public _maxY: number;

    constructor(x: number, y: number, element: Element, maxX: number, maxY: number) {
        this._x = x;
        this._y = y;
        this._element = element;
        this._maxX = maxX;
        this._maxY = maxY;
    }

}

export class MoveByArrowKey {

    private rows: Element[] = [];
    private cells: Array<Cell> = [];
    private focusingElement: Cell;

    constructor(rows: any, cellClassName: string) {
        this.rows = Array.from(rows);

        const rowsExludingColumns = this.rows.filter(row => {
            const hasAnyCol = row.querySelectorAll(cellClassName).length ? true : false;
            return hasAnyCol;
        });

        rowsExludingColumns.forEach((row, rowIndex) => {
            const cols = row.querySelectorAll(cellClassName);
            cols.forEach((col: HTMLInputElement, colIndex) => {
                const cell = new Cell(colIndex, rowIndex, col, cols.length, rows.length);

                col.onfocus = this.handleFocusOnCell.bind(this);
                col.onkeydown = this.debounce(this.handleKeydownOnCell.bind(this), 50);

                this.cells.push(cell);
            });
        });

    }

    private handleFocusOnCell(event) {
        const { target } = event;
        this.focusingElement = this.cells.find(cell => cell._element === target);
    }

    private handleKeydownOnCell(event: KeyboardEvent) {

        if (!this.focusingElement || !this.focusingElement._element) return;

        const whichKey = event.key;
        const isTopDown = ['ArrowUp', 'ArrowDown'].includes(whichKey);
        let input = this.focusingElement._element as HTMLInputElement;

        let curX = this.focusingElement._x;
        let curY = this.focusingElement._y;
        let maxX = this.focusingElement._maxX;
        let maxY = this.focusingElement._maxY;
        let value = input.value;
        let start = input.selectionStart;

        switch(whichKey) {
            case 'ArrowLeft':
                if (curX > 0) curX--;
                break;
            case 'ArrowRight':
                if (curX < maxX - 1) curX++;
                break;
            case 'ArrowUp':
                if (curY > 0) curY--;
                break;
            case 'ArrowDown':
                if (curY < maxY - 1) curY++;
                break;
        }
        
        const nextFocus = this.findCellByXY(curX, curY);
        const rect = nextFocus && nextFocus._element ? nextFocus._element.getBoundingClientRect() : { width: 0, height: 0 };

        const moveable = (whichKey === 'ArrowRight' && start === value.length) || (whichKey === 'ArrowLeft' && start === 0);

        if (rect.width && rect.height) {
            if (moveable || isTopDown) {
                this.focusingElement = nextFocus;
                (this.focusingElement._element as HTMLInputElement).focus();
            }
        }
        
    }

    private findCellByXY(x: number, y: number) {
        return this.cells.find(cell => cell._x === x && cell._y === y);
    }

    private debounce(func: Function, wait: number) {
        let timeout;
      
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
      
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
    }

}