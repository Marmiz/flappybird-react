import React, { Component, Fragment } from 'react';
import './App.css';
import Bird from "./Components/Bird";
import Pipe from "./Components/Pipe";
import {generateRandomShift, generateRandomEase} from "./helpers";

class App extends Component {
  state = {
    minTop: 0,
    maxBot: 670,
    top: 60,
    velocity: 16,
    deltaTop: 0,
    jumpDistance: -5,
    timerId : undefined,
    pipes: [{
      x: 1280,
      shift: generateRandomShift(),
      id: 123,
      ease: generateRandomEase(),
    }],
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
        shift: generateRandomShift(),
        id: Math.random(),
        ease: generateRandomEase(),
      }
      copy.push(o)
    };
    // each block should take 2s
    const movePipes = copy.map((p) => Object.assign(p, {x: p.x - 12.66}));
    return movePipes;
  }

  updateGame = () => {
    const newFallPosition = this.fall();
    const newPipes = this.updatePipes();

    // check collision
    // top = pipeHeight - shift
    // bot = shift - 50 birdHeigh

    this.setState({top: newFallPosition.newPos, pipes: newPipes, deltaTop: newFallPosition.newDeltaPos});

  }

  startGame = () => {
    const {timerId} = this.state;
    if(!timerId) {
      const t = setInterval(() => this.updateGame(), 16.66 );

      this.setState({ timerId: t})
    }
  }

  stopGame = () => {
    const {timerId} = this.state;
    if(!timerId) { return console.error('no timer set')}

    clearInterval(timerId);
  }

  handlePress = e => {
    const kc = e.keyCode;
    console.log(kc)
    if(kc === 32) {
      this.jump();
    }

    if(kc === 80) {
      this.stopGame();
    }
  }

  render() {
    const {top, pipes} = this.state;
    return (
      <div className="App" onClick={this.startGame}>
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
