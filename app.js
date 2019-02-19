document.addEventListener("DOMContentLoaded", loadGame)

function loadGame() {
  const game = new Board(4,4);
  game.createBoard();

  const shuffleButton = document.getElementById("shuffleButton");
  shuffleButton.addEventListener("click", () => game.shuffleBoard());
}

class Board {
  constructor(width, height) {
    this.blockArray = Array(width * height).fill().map((elem, i) => i === 0 ? null : i); 
    this.width = width; // number of blocks in row
    this.height = height; // number of blocks in column
  }

  createBoard() {
    for (let i = 0; i < this.height; i++) {
      const blockRow = document.createElement("div"); 
      for (let i = 0; i < this.width; i++) {
        const block = this.createBlock(); // creates a block DOM element
        blockRow.append(block);
      }
      document.getElementById("board").append(blockRow);
    }
    this.shuffleBoard();
  }

  // shuffle w/o replacement using Fisher-Yates algorithm
  shuffleBoard() {
    const arr = this.blockArray;
    for (let i = arr.length - 1; i > 0; i--) {
      const iRandom = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[iRandom]] = [arr[iRandom], arr[i]];
    }
    this.render();
  }

  createBlock() {
    const block = document.createElement("div")

    block.addEventListener("click", () => this.moveBlock(block));
    block.className = 'block'
    return block;
  }

  moveBlock(block) {
    if (block.value === null) {
      return
    }

    const arr = this.blockArray
    const iSelected = arr.indexOf(block.value)
    const iEmptyBlock = arr.indexOf(null);
    
    const isSameColumn = iSelected % this.width === iEmptyBlock % this.width;
    const emptyIsAboveSelected = iSelected < iEmptyBlock
    const emptyIsBelowSelected = iSelected > iEmptyBlock
    const canMoveUp = isSameColumn && emptyIsBelowSelected
    const canMoveDown = isSameColumn && emptyIsAboveSelected

    const rowOfSelected = Math.ceil((iSelected + 1)/this.width)
    const rowOfEmpty = Math.ceil((iEmptyBlock + 1)/this.width)
    const isSameRow = (rowOfSelected === rowOfEmpty)
    const emptyIsRightOfSelected = (iSelected - iEmptyBlock) < 0;
    const emptyIsLeftOfSelected = (iSelected - iEmptyBlock) > 0;
    const canMoveLeft = isSameRow && emptyIsLeftOfSelected
    const canMoveRight = isSameRow && emptyIsRightOfSelected

    if (canMoveRight) {
        let p1 = iEmptyBlock 
        let p2 = iEmptyBlock - 1
        let i = iSelected % this.width
        let endPoint = (iEmptyBlock % this.width)

        while (i !== endPoint && p2 >= iSelected) {
            let temp2 = arr[p1]
            arr[p1] = arr[p2]
            arr[p2] = temp2
            i++      
            p1--
            p2--
        }
    } else if (canMoveLeft) {
        let p1 = iEmptyBlock 
        let p2 = iEmptyBlock + 1
        let i = iSelected % this.width
        let endPoint = (iEmptyBlock % this.width)
        while (i !== endPoint && p2 <= iSelected) {
            let temp3 = arr[p1]
            arr[p1] = arr[p2]
            arr[p2] = temp3
            p1++
            p2++
            i--
        }
    } else if (canMoveUp) {
        let p1 = iEmptyBlock 
        let p2 = iEmptyBlock + this.width 
        let i = Math.floor(iSelected/(this.width))
        let endPoint = Math.floor(iEmptyBlock/(this.width))
        while(i !== endPoint && p2 <= iSelected) {
            let temp3 = arr[p1]
            arr[p1] = arr[p2]
            arr[p2] = temp3
            p1+=this.width
            p2+=this.width
            i-- 
        }
    } else if (canMoveDown) {
        let p1 = iEmptyBlock 
        let p2 = iEmptyBlock - this.width 
        let i = Math.floor(iSelected/(this.width))
        let endPoint = Math.floor(iEmptyBlock/(this.width))
        while(i !== endPoint && p2 >= iSelected) { 
          let temp3 = arr[p1]
          arr[p1] = arr[p2]
          arr[p2] = temp3
          p1-=this.width 
          p2-=this.width 
          i++ 
        }
    }

   this.render();   
  } 

  renderBlock(block, blockValue, position) {
    block.innerHTML = blockValue === null ? '&nbsp;' : blockValue
    block.value = blockValue;

    if (blockValue === null) {
      block.className = 'block empty-block'
    } else if (blockValue === position + 1) {
      block.className = 'block correct-block'
    } else {
      block.className = 'block incorrect-block'
    }
  }

  render() {
    const board = document.getElementById("board");
    Array(...board.children).forEach((boardRow, i) => {
      Array(...boardRow.children).forEach((block, j) => {
        const position = i * this.width + j;
        const blockValue = this.blockArray[position];
        this.renderBlock(block, blockValue, position);
      });
    });
  }
}

