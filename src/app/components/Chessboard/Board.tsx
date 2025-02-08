import React from 'react'
import { Chessboard } from 'react-chessboard'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'

interface BoardProps{
  orientation?: BoardOrientation,
  size: number

}

const Board: React.FC<BoardProps> = (
  {orientation='white',
    size
  }
) => {
  return (
    <Chessboard id="defaultBoard"
    boardWidth={size}
    boardOrientation={orientation}
      />
  )
}

export default Board