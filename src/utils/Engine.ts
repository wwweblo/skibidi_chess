// utils/Engine.ts
const stockfishWorker = () => new Worker("/stockfish.wasm.js", { type: "module" });

// Определение интерфейса EngineMessage
interface EngineMessage {
  uciMessage: string;
  bestMove?: string;
  ponder?: string;
  evaluation?: number; // числовая оценка (в центпешах)
  possibleMate?: number;
  pv?: string;
  depth?: number;
}

export default class Engine {
  private stockfish: Worker;
  private isReady: boolean;

  constructor() {
    this.stockfish = stockfishWorker();
    this.isReady = false;
    this.init();
  }

  private transformSFMessageData(e: MessageEvent): EngineMessage {
    const uciMessage = e.data ?? "";

    // Извлечение оценки cp (в центпешах). Регулярное выражение ищет число с возможным знаком.
    const cpMatch = uciMessage.match(/cp\s+(-?\d+)/);
    const evaluation = cpMatch ? Number(cpMatch[1]) : undefined;

    // Извлечение информации о мейте, если присутствует.
    const mateMatch = uciMessage.match(/mate\s+(-?\d+)/);
    const possibleMate = mateMatch ? Number(mateMatch[1]) : undefined;

    const bestMove = uciMessage.match(/bestmove\s+(\S+)/)?.[1];
    const ponder = uciMessage.match(/ponder\s+(\S+)/)?.[1];
    const pv = uciMessage.match(/ pv\s+(.*)/)?.[1];

    const depthMatch = uciMessage.match(/ depth\s+(\d+)/);
    const depth = depthMatch ? Number(depthMatch[1]) : 0;

    return {
      uciMessage,
      bestMove,
      ponder,
      evaluation,
      possibleMate,
      pv,
      depth,
    };
  }

  private init(): void {
    this.stockfish.postMessage("uci");
    this.stockfish.postMessage("isready");
    this.stockfish.addEventListener("message", (e: MessageEvent) => {
      if (e.data === "readyok") {
        this.isReady = true;
      }
    });
  }

  onMessage(callback: (messageData: EngineMessage) => void): void {
    this.stockfish.addEventListener("message", (e: MessageEvent) => {
      callback(this.transformSFMessageData(e));
    });
  }

  evaluatePosition(fen: string, depth: number = 12): void {
    if (depth > 24) depth = 24;
    this.stockfish.postMessage(`position fen ${fen}`);
    this.stockfish.postMessage(`go depth ${depth}`);
  }

  stop(): void {
    this.stockfish.postMessage("stop");
  }

  terminate(): void {
    this.isReady = false;
    this.stockfish.postMessage("quit");
    this.stockfish.terminate();
  }
}
