const { spawn } = require('child_process');

const AIRunner = class {
  /**
   * Construct a class to run the C++ AI executable
   * @param {Int} id - Corresponds to the ID of the game that the AI is playing
   * @param {*} type - Corresponds to the type AI. 1 = Random, 2 = Deterministic, 3 = Learning
   */
  constructor(id, type){
    this._id = id;
    this._type = type.toString();
    this._output = '';
  }

  /**
   * Start the AI in another process. All output to stdout is added to this._output.
   * 
   * @modify {*} this._output - Changed to include the output of AI file.
   */

  startAI(){
    const input_board = "../AI/BOARD" + this._id.toString() + ".txt";
    const AI = spawn('../AI/a.out', [input_board, 'out.txt', this._type, '5', 'false', 50]);
    
    AI.stdout.on('data', (data) => {
      this._output += data.toString();
    });
    
    AI.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    AI.on('close', (code) => {
      console.log(`AI ${this._id} exited with code ${code}`);
    });
  }

  /**
   * Return the guess of the AI 
   */
  retrieveGuess() {
    const guess = {x: this._output[0], y: this._output[2]};
    this._output = this._output.substring(0, 4);
    return guess;
  }

  /**
   * Check to see if a guess can be achieved
   */
  checkGuess() {
    return this._output.length >= 4;
  }
}

module.exports = AIRunner;