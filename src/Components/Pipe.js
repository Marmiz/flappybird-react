import React from "react";
import '../App.css';

const Pipe = ({x, shift, ease, type}) => {
  // const yBottom = (shift - ease) old bottom shift {top: yShift}
  const yBottom = (shift - ease) - 720
  const y = type === 'top' ? {top: -shift} : { bottom: yBottom };
  const style = Object.assign({left: `${x}px`}, y);
  return <div className="Pipe" style={style} />
}

export default Pipe;
