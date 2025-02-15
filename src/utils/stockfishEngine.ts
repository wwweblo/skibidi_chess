export default class Engine {
  private stockfish: Worker | null;
  private messageCallback: ((data: { bestMove?: string }) => void) | null = null;

  constructor() {
    this.stockfish =
      typeof Worker !== "undefined" ? new Worker("/stockfish.js") : null;
    this.onMessage = this.onMessage.bind(this);

    if (this.stockfish) {
      this.sendMessage("uci");
      this.sendMessage("isready");
    }
  }

  onMessage(callback: (data: { bestMove?: string }) => void) {
    this.messageCallback = callback;

    if (this.stockfish) {
      this.stockfish.addEventListener("message", (e) => {
        const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];
        if (bestMove && this.messageCallback) {
          this.messageCallback({ bestMove });
        }
      });
    }
  }

  evaluatePosition(fen: string, depth: number) {
    if (this.stockfish) {
      this.stockfish.postMessage(`position fen ${fen}`);
      this.stockfish.postMessage(`go depth ${depth}`);
    }
  }

  stop() {
    this.sendMessage("stop");
  }

  quit() {
    this.sendMessage("quit");
  }

  terminate() {
    if (this.stockfish) {
      this.stockfish.terminate();
      this.stockfish = null;
    }
  }

  private sendMessage(message: string) {
    if (this.stockfish) {
      this.stockfish.postMessage(message);
    }
  }
}
