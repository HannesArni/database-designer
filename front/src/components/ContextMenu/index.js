import { useStoreState } from "react-flow-renderer";
import { memo } from "react";
import ContextMenuContent from "./Menu";

const ContextMenu = ({ open, onClose, pos, actions }) => {
  const { x: xPos, y: yPos } = pos;
  const transform = useStoreState((store) => store.transform);
  const handleActionClick = (actionHandler) => {
    onClose();
    actionHandler({
      xPos: (xPos - transform[0]) / transform[2],
      yPos: (yPos - transform[1]) / transform[2],
    });
  };

  return (
    <>
      <ContextMenuContent
        handleActionClick={handleActionClick}
        open={open}
        onClose={onClose}
        actions={actions}
        yPos={yPos}
        xPos={xPos}
      />
    </>
  );
};
export default memo(ContextMenu);
