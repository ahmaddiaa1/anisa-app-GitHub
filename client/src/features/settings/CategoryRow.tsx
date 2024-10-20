import { TagType } from "../../types/types";
import Table from "../../ui/Table";

import { format } from "date-fns";
import { formatCurrency } from "../../utils/helpers";
import Tag from "../../ui/Tag";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import CreateCategory from "./CreateCategory";
import { useUser } from "../../hooks/users/useUser.ts";

const CategoryRow = ({
  category,
}: {
  category: {
    id: string;
    title: string;
    type: string;
    unitPrice: number;
    isEnable: boolean;
    createdAt: string;
    minHours?: number;
    maxHours?: number;
  };
}) => {
  const {
    id,
    title,
    type,
    unitPrice,
    isEnable,
    createdAt,
    minHours,
    maxHours,
  } = category;

  const ActionColor: { [key: string]: TagType } = {
    true: "blue",
    false: "red",
  };

  const { notModerator } = useUser();

  return (
    <Table.Row>
      <div>{title}</div>
      <div>{type}</div>

      <Tag $type={ActionColor[isEnable.toString()]}>
        {isEnable ? "Enable" : "Disable"}
      </Tag>

      <div>
        {type === "hourly"
          ? `from ${minHours} to ${maxHours} Hours `
          : `${maxHours} Hours`}
      </div>
      <div>
        {formatCurrency(unitPrice)} / {type === "hourly" ? "H" : "PT"}
      </div>
      <div>{format(createdAt, "dd MMM yyyy")}</div>
      <div>
        {notModerator && (
          <Modal>
            <Menus.Toggle id={category.title} />
            <Menus.List id={category.title}>
              <Modal.Open opens="edit">
                <Menus.Button>Update</Menus.Button>
              </Modal.Open>
            </Menus.List>
            <Modal.Window name="edit">
              <CreateCategory editID={id} />
            </Modal.Window>
          </Modal>
        )}
      </div>
    </Table.Row>
  );
};
export default CategoryRow;
