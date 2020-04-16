const { spawnSync } = require('child_process');
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
    const input_board = "./AI/Board" + this._id.toString() + ".txt";
    const AI = spawn('./AI/t.exe', [input_board, './AI/out.txt', this._type, '5', 'false', 50]);
    
    AI.stdout.on('data', (data) => {
      console.log(data.toString());
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
   * Start the AI in sync with the program. Blocks execution until finish.
   * 
   * @modify {*} this._output - Changed to include the output of AI file.
   */

  startAISync(){
    const input_board = "./AI/Board" + this._id.toString() + ".txt";
    const AI = spawnSync('./AI/t.exe', [input_board, 'out.txt', this._type, '5', 'false', 50]);

    this._output += AI.stdout.toString();

    console.log(AI.stderr.toString());


    console.log(`AI ${this._id} exited with code ${AI.status.toString()}`);

  }

  /**
   * Return the guess of the AI 
   */
  retrieveGuess() {
    const guess = {x: this._output[0], y: this._output[2]};
    this._output = this._output.substring(4);
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