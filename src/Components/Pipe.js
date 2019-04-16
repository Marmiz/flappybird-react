import React from "react";
import '../App.css';

const Pipe = ({x, height, type}) => {
  const y = type === 'bot' ? {height: height[0]}: {height: height[1]};
  const style = Object.assign({left: `${x}px`}, y);
  const cName = type === 'bot' ? "Pipe bottom" : "Pipe top";
  return <div className={cName} style={style} />
}

export default Pipe;
