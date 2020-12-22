import { Transition } from "react-transition-group";
import { useState, useRef } from "react";

const duration = 300;
const defaultStyle = {
  transition: `height ${duration}ms ease-in-out, width ${duration}ms ease-in-out`,
  overflow: "hidden",
  height: 0,
  // position: "absolute",
  // width: "100%",
  // height: "100%",
};

const CustomCollapse = ({ children, open }) => {
  const wrapperRef = useRef();
  const innerWrapper = useRef();
  const transitionStyles = {
    entered: { height: "auto", width: "auto" },
  };
  const handleEnter = (node) => {
    node.style.position = "absolute";
    node.style.height = "100%";
    node.style.width = "100%";
  };
  const handleEntering = (node) => {
    console.log(
      "entering",
      innerWrapper.current?.clientHeight,
      node.clientWidth
    );
    node.style.position = "";
    node.style.height = innerWrapper.current?.clientHeight + "px";
    node.style.width = "100%";
  };
  const handleExit = (node) => {
    const width = node.clientWidth;
    const height = node.clientHeight;
    console.log("exit", height, width);
    node.style.height = `${height}px`;
    node.style.width = `${width}px`;
    console.log(node.style.height, node.style.width);
  };
  const handleExiting = (node) => {
    const width = node.clientWidth;
    const height = node.clientHeight;
    console.log("exiting", height, width);
    // node.style.height = height + "px";
    // node.style.width = width + "px";
    // node.style.width = 0;
    node.style.height = 0;
  };
  return (
    <Transition
      in={open}
      timeout={duration}
      onEnter={handleEnter}
      onEntering={handleEntering}
      // onExit={handleExit}
      onExiting={handleExiting}
      unmountOnExit
    >
      {(state) => (
        <div
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
          ref={wrapperRef}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <div
              style={{
                width: "auto",
                height: "auto",
              }}
              ref={innerWrapper}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
};

export default CustomCollapse;
