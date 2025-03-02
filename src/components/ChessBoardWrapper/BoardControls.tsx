// components/ChessBoardWrapper/BoardControls.tsx
import React from "react";
import Button from "../Button/Button";
import EvaluationBar from "../ProgressBar/Progressbar";
import style from "./ChessBoardWrapper.module.css";

interface BoardControlsProps {
  isFenVisible?: boolean;
  isTakebackAble?: boolean;
  fenPosition: string;
  copyStatus: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFenInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCopyFen: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onRestart: () => void;
  boardOrientation: "white" | "black";
  onFlipBoard: () => void;
  evaluation: number;     // процент для шкалы
  numericEval: number;    // оценка в центпешах
}

const BoardControls: React.FC<BoardControlsProps> = ({
  isFenVisible,
  isTakebackAble,
  fenPosition,
  copyStatus,
  inputRef,
  onFenInputChange,
  onCopyFen,
  onUndo,
  onRedo,
  onRestart,
  boardOrientation,
  onFlipBoard,
  evaluation,
  numericEval
}) => {
  return (
    <div className={style.controls}>
      {isFenVisible && (
        <div className={style.fenContainer}>
          <Button size="small" variant="info" onClick={onCopyFen}>
            {copyStatus || "📋 FEN"}
          </Button>
          <input
            ref={inputRef}
            value={fenPosition}
            onChange={onFenInputChange}
            placeholder="Введите FEN"
            className={style.fenInputField}
          />
        </div>
      )}
      {isTakebackAble && (
        <div className={style.actions}>
          <Button size="small" variant="neutral" onClick={onUndo}>
            ↩️ Отменить
          </Button>
          <Button size="small" variant="neutral" onClick={onRedo}>
            ↪️ Вернуть
          </Button>
          <Button size="small" variant="decline" onClick={onRestart}>
            🗑️ Перезапустить
          </Button>
        </div>
      )}
      <Button size="small" variant="neutral" onClick={onFlipBoard}>
        🔄 Перевернуть доску
      </Button>
      <div className={style.evaluationContainer}>
        <p>Оценка позиции:</p>
        <EvaluationBar progress={evaluation} />
        <p>
          {numericEval >= 0
            ? `+${(numericEval / 100).toFixed(2)}`
            : (numericEval / 100).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default BoardControls;
