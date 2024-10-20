import { useForm } from "react-hook-form";
import Form from "../../ui/Form.tsx";
import Button from "../../ui/Button.tsx";
import FormRow from "../../ui/FormRow.tsx";

import Input from "../../ui/Input.tsx";
import Select from "../../ui/SelectOption.tsx";
import { useEffect, useState } from "react";
import { useCreateCategory } from "../../hooks/useCreateCategory.ts";
import { OrderCategory } from "../../types/ordersTypes.ts";
import useGetOrderCategory from "../../hooks/useGetSingleOrderCategory.ts";
import useUpdateOrderCategory from "../../hooks/useUpdateOrderCategory.ts";

function CreateCategory({
  editID,
  onCloseModal,
}: {
  editID?: string;
  onCloseModal?: () => void;
}) {
  const { register, handleSubmit, reset, formState } = useForm<any>({});
  const { errors } = formState as any;
  const [isHourly, setIsHourly] = useState<boolean>(false);
  const { createCategory, isCreating } = useCreateCategory();
  const { updateCategory, isUpdating } = useUpdateOrderCategory();
  const { data: Category } = useGetOrderCategory(editID ?? "");

  useEffect(() => {
    if (Category) {
      reset({
        ...Category,
      });
    }
  }, [editID, Category]);

  const onSubmit = (data: OrderCategory) => {
    if (editID) {
      updateCategory(
        {
          id: editID,
          dataForm: data,
        },
        {
          onSuccess: () => onCloseModal?.(),
        }
      );
    } else {
      createCategory(data, {
        onSuccess: () => onCloseModal?.(),
      });
    }
  };
  const isWorking = isUpdating || isCreating;
  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={!onCloseModal ? "regular" : "modal"}
    >
      <FormRow label="Title" error={errors?.title?.message}>
        <Input
          type="text"
          id="title"
          disabled={isWorking}
          {...register("title", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Type" error={errors?.type?.message}>
        <Select
          id="type"
          disabled={isWorking}
          {...register("type", {
            required: "This field is required",
            onChange: (e) => setIsHourly(e.target.value === "hourly"),
          })}
        >
          <option value="hourly">Hourly</option>
          <option value="unitPrice">Total</option>
        </Select>
      </FormRow>
      <FormRow label="Price" error={errors?.unitPrice?.message}>
        <Input
          type="number"
          id="unitPrice"
          disabled={isWorking}
          {...register("unitPrice", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Anisa Price" error={errors?.anisaPrice?.message}>
        <Input
          type="number"
          id="anisaPrice"
          disabled={isWorking}
          {...register("anisaPrice", {
            required: "This field is required",
          })}
        />
      </FormRow>
      {editID && (
        <FormRow label="Enable" error={errors?.isEnable?.message}>
          <Select
            id="isEnable"
            disabled={isWorking}
            {...register("isEnable", {
              required: "This field is required",
            })}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </Select>
        </FormRow>
      )}
      {isHourly && (
        <FormRow label="Min Hours" error={errors?.minHours?.message}>
          <Input
            type="number"
            id="minHours"
            disabled={isWorking}
            {...register("minHours", {
              required: "This field is required",
            })}
          />{" "}
        </FormRow>
      )}

      <FormRow
        label={!isHourly ? "Total Time" : "Max Hours"}
        error={errors?.maxHours?.message}
      >
        <Input
          type="number"
          id="maxHours"
          disabled={isWorking}
          {...register("maxHours", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        <Button
          $variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button>Add Category</Button>
      </FormRow>
    </Form>
  );
}
export default CreateCategory;
