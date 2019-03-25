import React, { Component, Fragment } from 'react';
import './App.css';
import Bird from "./Components/Bird";
import Pipe from "./Components/Pipe";
import {generatePipeHeight} from "./helpers";

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
      height: generatePipeHeight(),
      id: 123
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
    const cleaned = pipes.filter(p => p.x >= -19.20);
    const missing = (5 - cleaned.length);
    let baseDistance = 1280;
    const copy = [...cleaned];
    for(let i = 0; i < missing; i++) {
      baseDistance += 256;
      const o = {
        x: baseDistance,
        height: generatePipeHeight(),
        id: Math.random(),
      }
      copy.push(o)
    };
    const movePipes = copy.map((p) => Object.assign(p, {x: p.x - 19.20}));
    return movePipes;
  }

  updateGame = () => {
    const newFallPosition = this.fall();
    const newPipes = this.updatePipes();

    this.setState({top: newFallPosition.newPos, pipes: newPipes, deltaTop: newFallPosition.newDeltaPos});

  }

  startGame = () => {
    const {timerId} = this.state;
    if(!timerId) {
      const t = setInterval(() => this.updateGame(), 16.66 );

      this.setState({ timerId: t})
    }
  }

  handlePress = e => {
    const kc = e.keyCode;
    if(kc === 32) {
      this.jump();
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
