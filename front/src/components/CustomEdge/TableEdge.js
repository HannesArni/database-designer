import React from "react";
import { getMarkerEnd, getEdgeCenter } from "react-flow-renderer";

function getBezierPath({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
}) {
  // left: -1, right: 1
  const sm = sourcePosition === "left" ? -1 : 1;
  const tm = targetPosition === "left" ? -1 : 1;
  const [cX] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  // defaults, for if the handles are facing each other
  const sourceControl = [cX, sourceY];
  const targetControl = [cX, targetY];
  if (sourcePosition === targetPosition) {
    // If they're on the same side,
    // we move the control points 50px in the same direction
    sourceControl[0] = sourceX + 50 * sm;
    targetControl[0] = targetX + 50 * tm;
  }

  // we move the start and end points 5 to the side direction, for looks
  const startPos = `${sourceX + 5 * sm},${sourceY}`;
  const endPos = `${targetX + 5 * tm},${targetY}`;
  const startControl = sourceControl.join(",");
  const endControl = targetControl.join(",");
  return `M${startPos} C${startControl} ${endControl} ${endPos}`;
}

const TableEdge = ({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}) => {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
    </>
  );
};
export default TableEdge;
