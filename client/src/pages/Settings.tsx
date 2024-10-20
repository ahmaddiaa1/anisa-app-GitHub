import Heading from "../ui/Heading";
import Row from "../ui/Row.tsx";
import AddressForm from "../features/address/AddressForm.tsx";
import OrderCategoryTable from "../features/settings/OrderCategortTable.tsx";
import CategoryTableOperations from "../features/settings/CategoryTableOperations.tsx";
import AddCategory from "../features/settings/AddCategory.tsx";
import { useUser } from "../hooks/users/useUser.ts";

function Settings() {
  const { notModerator } = useUser();
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Settings </Heading>
        <CategoryTableOperations />
      </Row>
      <Row>
        <OrderCategoryTable />
        {notModerator && <AddCategory />}
      </Row>
      {notModerator && (
        <Row>
          <Heading as="h1">Address</Heading>
          <AddressForm />
        </Row>
      )}
    </>
  );
}

export default Settings;
