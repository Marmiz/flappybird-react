import React, { Component, Fragment } from 'react';
import './App.css';
import Bird from "./Components/Bird";
import Pipe from "./Components/Pipe";
import Controls from "./Components/Controls";
import Score from "./Components/Score";
import { generatePipePairs, initialState } from "./helpers";

class App extends Component {
  state = {
    gameRunning: false,
    minTop: 0,
    maxBot: 670,
    top: 60,
    velocity: 16,
    deltaTop: 0,
    jumpDistance: -5,
    timerId : undefined,
    pipes: [],
    scorePipe: false,
    score: 0,
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handlePress)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handlePress)
  }

  fall = () => {
    const {top, velocity, maxBot, deltaTop} = this.state;
    // update
    let deltaPos = deltaTop + (velocity * 0.016);
    const newPos = top + deltaPos;
    // const newPos = top + velocity

    //return new pos
    return { newPos: newPos <= maxBot ? newPos : maxBot, newDeltaPos: deltaPos};
  }

  jump = () => {
    const {top, jumpDistance, minTop} = this.state;
    const deltaPos = jumpDistance;
    const newPos = top + deltaPos;

    // this.setState({top: newPos >= minTop ? newPos : minTop})
    this.setState({top: newPos >= minTop ? newPos : minTop, deltaTop: deltaPos});
  }

  updatePipes = () => {
    const { pipes } = this.state;
    // first remove out of bound pipes
    const cleaned = pipes.filter(p => p.x >= -50);
    const missing = (4 - cleaned.length);
    let baseDistance = 1280;
    const copy = [...cleaned];
    for(let i = 0; i < missing; i++) {
      baseDistance += 451;
      const o = {
        x: baseDistance,
        id: Math.random(),
        height: generatePipePairs(),
      }
      copy.push(o)
    };
    // each block should take 2s
    const movePipes = copy.map((p) => Object.assign(p, {x: p.x - 12.66}));
    return movePipes;
  }

  updateGame = (winningPipe) => {
    const { scorePipe, score } = this.state;
    const newScore = scorePipe && scorePipe !== winningPipe ? score + 1 : score;

    const newFallPosition = this.fall();
    const newPipes = this.updatePipes();

    this.setState({
      top: newFallPosition.newPos,
      pipes: newPipes,
      deltaTop: newFallPosition.newDeltaPos,
      scorePipe: winningPipe,
      score: newScore,
    });

  }

  checkGame = () => {
    const {top, pipes} = this.state;
    // check for collision
    // get pipe that is in possible range for collision,
    // an x value that goes from 20 to 120
    const collisionPipe = pipes.filter(p => p.x >= 20 && p.x <= 120);
    if(collisionPipe.length) {
      const pipe = collisionPipe[0];
      const topLimit = pipe.height[1]
      // give 5 pixel of grace
      // game height - 50px of fixed gap + 5 px of grace = 675
      // minus bot pipe height gives the bot limit
      const botLimit = (670 - pipe.height[0] );

      if(top <= topLimit - 5 || top >= botLimit + 5) {
        return this.stopGame();
      }
    }

    // get possible pipe we could have passed -> x > 0 && < 20
    const winningPipe = pipes.filter(p => p.x >= 0 && p.x <= 20);
    if(winningPipe.length) {
      return this.updateGame(winningPipe[0].id);
    }

    this.updateGame(false);
  }

  startGame = () => {
      const t = setInterval(() => this.checkGame(), 16.66 );
      this.setState({ timerId: t, gameRunning: true })
  }

  stopGame = (pause) => {
    const {timerId} = this.state;
    if(!timerId) { return console.error('no timer set')}

    clearInterval(timerId);
    const gameState = pause ? 'pause' : false;
    this.setState({ gameRunning: gameState });
  }

  resetGame = () => {
    const { gameState } = this.state;
    if(gameState === 'pause') {
      return this.startGame();
    }

    this.setState(initialState);
  }

  handlePress = e => {
    const { gameRunning } = this.state;
    const kc = e.keyCode;

    // space -> Jump
    if(kc === 32) {
      if(gameRunning) {
        this.jump();
      }
    }

    // S -> Start
    if(kc === 83) {
      if(!gameRunning) {
        this.startGame();
      }
    }

    // P -> Pause / Unpause
    if(kc === 80) {
      if(gameRunning === 'pause') {
        return this.startGame();
      }
      if(gameRunning) {
        this.stopGame(true);
      }
    }

    // R -> Reset
    if(kc === 82) {
      if(!gameRunning) {
        this.resetGame();
      }
    }
  }

  render() {
    const {top, pipes, score } = this.state;
    return (
      <div className="App">
        <Score score={score} />
        <Controls />
        <Bird top={top}/>
        {
          pipes.map((p) => <Fragment key={p.id}>
            <Pipe {...p} type="top"/>
            <Pipe {...p} type="bot"/>
            </Fragment>)
        }
      </div>
    );
  }
}

export default App;
