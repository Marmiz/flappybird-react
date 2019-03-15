import React from "react";
import '../App.css';

const Pipe = ({x, height, type}) => {
  const top = type ==="top" ? 0 : (720 - height);
  const style = {left: `${x}px`, height: `${height}px`, top: `${top}px`}
  return <div className="Pipe" style={style} />
}

export default Pipe;
