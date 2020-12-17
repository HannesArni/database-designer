import { Menu, MenuItem } from "@material-ui/core";
import { useStoreState } from "react-flow-renderer";

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
      <Menu
        keepMounted
        open={open}
        onClose={() => onClose()}
        anchorReference="anchorPosition"
        anchorPosition={
          yPos !== null && xPos !== null ? { top: yPos, left: xPos } : undefined
        }
      >
        {actions.map(({ label, action }, index) => (
          <MenuItem key={index} onClick={() => handleActionClick(action)}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
export default ContextMenu;
