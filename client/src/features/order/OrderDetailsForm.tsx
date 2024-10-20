import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import SelectSearch from "../../ui/SelectSearchT";
import { Order } from "../../types/ordersTypes";
import { anisaData } from "../../types/anisaTypes";

const OrderDetailsForm = ({
  defaultValue,
  setValue,
  errors,
  isWorking,
  anisa,
  register,
}: {
  defaultValue: anisaData;
  setValue: UseFormSetValue<Order>;
  errors: any;
  isWorking: boolean;
  anisa: anisaData[];
  OrderStatus: any;
  register: UseFormRegister<Order>;
}) => {
  return (
    <div className="Form">
      <FormRow label="Anisa" error={errors?.orderCategory?.message}>
        <SelectSearch
          options={anisa}
          fieldName={"anisaID"}
          valueField={"id"}
          labelField={"fullName"}
          defaultValue={defaultValue}
          setValues={setValue}
          disabled={isWorking}
        />
      </FormRow>

      <FormRow label="Done Hours" error={errors?.doneHours?.message}>
        <Input
          type="number"
          id="doneHours"
          disabled={isWorking}
          {...register("doneHours", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Payed Amount" error={errors?.payedAmount?.message}>
        <Input
          type="number"
          id="payedAmount"
          disabled={isWorking}
          {...register("payedAmount", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Anisa absent" error={errors?.absent?.message}>
        <Input
          type="number"
          id="absent"
          disabled={isWorking}
          {...register("absent", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Location" error={errors?.location?.message}>
        <Input
          type="text"
          id="location"
          disabled={isWorking}
          {...register("location", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Start Date" error={errors?.startDate?.message}>
        <Input
          type="datetime-local"
          id="startDate"
          disabled={isWorking}
          {...register("startDate", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="End Date" error={errors?.endDate?.message}>
        <Input
          type="datetime-local"
          id="endDate"
          disabled={isWorking}
          {...register("endDate", {
            required: "This field is required",
          })}
        />
      </FormRow>
    </div>
  );
};
export default OrderDetailsForm;
