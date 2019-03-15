import React from "react";
import '../App.css';

const Bird = ({top}) => {
  const style = {top: `${top}px`};

  return (
    <div className="Bird" style={style}></div>
  )
}

export default Bird;
