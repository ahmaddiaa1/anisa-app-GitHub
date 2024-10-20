import { useFieldArray, useForm } from "react-hook-form";
import Form from "../../ui/Form.tsx";
import Button from "../../ui/Button.tsx";
import FormRow from "../../ui/FormRow.tsx";

import { Order, OrderValidation } from "../../types/ordersTypes.ts";
import SelectSearch from "../../ui/SelectSearchT.tsx";
import Input from "../../ui/Input.tsx";
import useGetOrderOptions from "../../hooks/orders/useGetOrderOptions.ts";
import useAddOrder from "../../hooks/orders/useAddOrder.ts";
import Spinner from "../../ui/Spinner.tsx";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Textarea from "../../ui/Textarea.tsx";

import { useDeleteNote } from "../../hooks/useDeleteNote.ts";
import ButtonGroup from "../../ui/ButtonGroup.tsx";
import { AddButton, RemoveButton } from "../../ui/ArrayButton.tsx";

function CreateOrder({
  clientID,
  onCloseModal,
}: {
  clientID?: { id: string; fullName: string };
  onCloseModal?: () => void;
}) {
  const { register, handleSubmit, control, setValue, getValues, formState } =
    useForm<Order>({
      defaultValues: {
        notes: [
          {
            id: "",
            body: "",
            createdAt: "",
          },
        ],
      },
    });
  const { errors } = formState as OrderValidation;

  const { orderCategory, client, anisa, isPending } = useGetOrderOptions();

  const { CreateOrder, isPending: isCreating } = useAddOrder();
  const { deleteNote } = useDeleteNote();

  const [isHourly, setIsHourly] = useState<any>();
  const [isChildren, setIsChildren] = useState<any>();

  const onSubmit = (data: Order) => {
    CreateOrder(data, {
      onSuccess: () => onCloseModal?.(),
    });
  };

  const {
    fields: notesFields,
    append: appendNote,
    remove: removeNote,
  } = useFieldArray({
    control,
    name: "notes",
  });

  useEffect(() => {
    setValue(
      "orderHours",
      isHourly?.type !== "hourly" ? isHourly?.maxHours : undefined
    );
  }, [isHourly?.type]);

  return (
    <>
      {!isPending ? (
        <Form
          onSubmit={handleSubmit(onSubmit)}
          type={!onCloseModal ? "regular" : "modal"}
        >
          <div className="name">
            <div className="">
              <FormRow label="Setting" error={errors?.orderCategoryID?.message}>
                <SelectSearch
                  setValues={setValue}
                  options={orderCategory}
                  fieldName="orderCategoryID"
                  disabled={isCreating}
                  labelField="title"
                  valueField="id"
                  onChange={(value) => {
                    setIsHourly(value);
                  }}
                />
              </FormRow>
              <FormRow label="Client" error={errors?.clientID?.message}>
                <SelectSearch
                  setValues={setValue}
                  options={client}
                  disabled={isCreating}
                  fieldName="clientID"
                  labelField="fullName"
                  valueField="id"
                  defaultValue={client.find(
                    (c: { id: string }) => c.id === clientID?.id
                  )}
                  onChange={(value) => {
                    setIsChildren(value);
                  }}
                />
              </FormRow>
              <FormRow label="Anisa" error={errors?.anisaID?.message}>
                <SelectSearch
                  disabled={isCreating}
                  setValues={setValue}
                  options={anisa}
                  fieldName="anisaID"
                  labelField="fullName"
                  valueField="id"
                />
              </FormRow>
              <FormRow label="childID" error={errors?.childID?.message}>
                <SelectSearch
                  setValues={setValue}
                  options={isChildren?.children}
                  fieldName={"childID"}
                  valueField={"id"}
                  labelField={"name"}
                  disabled={isCreating}
                />
              </FormRow>
              <FormRow
                label="Who Stays With Anisa"
                error={errors?.whoStaysWithAnisa?.message}
              >
                <Input
                  type="text"
                  id="whoStaysWithAnisa"
                  disabled={isCreating}
                  {...register("whoStaysWithAnisa", {
                    required: "This field is required",
                  })}
                />
              </FormRow>
              <FormRow label="Start Date" error={errors?.startDate?.message}>
                <Input
                  type="datetime-local"
                  id="startDate"
                  disabled={isCreating}
                  {...register("startDate", {
                    required: "This field is required",
                  })}
                />
              </FormRow>
              <FormRow label="End Date" error={errors?.endDate?.message}>
                <Input
                  type="datetime-local"
                  id="endDate"
                  disabled={isCreating}
                  {...register("endDate", {
                    required: "This field is required",
                  })}
                />
              </FormRow>
              <FormRow label="Order Hours" error={errors?.orderHours?.message}>
                <Input
                  type="number"
                  id="orderHours"
                  disabled={isCreating || isHourly?.type !== "hourly"}
                  {...register("orderHours", {
                    required: "This field is required",
                  })}
                />
              </FormRow>
              <FormRow label="Location" error={errors?.location?.message}>
                <Input
                  type="text"
                  id="location"
                  disabled={isCreating}
                  {...register("location", {
                    required: "This field is required",
                  })}
                />{" "}
              </FormRow>{" "}
            </div>
            <div
              style={{
                marginTop: "20px",
                borderTop: "1px solid var(--color-grey-100)",
                borderBottom: "1px solid var(--color-grey-100)",
                padding: "20px 0",
              }}
            >
              {notesFields.map((field, index) => (
                <FormRow
                  label={`Note ${index + 1}`}
                  key={field.id}
                  error={errors?.notes?.message}
                  createdAt={
                    field.createdAt
                      ? format(new Date(field.createdAt), "dd MMM yyyy")
                      : ""
                  }
                >
                  <Input type="hidden" {...register(`notes.${index}.id`)} />
                  <Textarea
                    id={`notes[${index}].body`}
                    disabled={isCreating}
                    {...register(`notes.${index}.body`, {
                      required: "This field is required",
                    })}
                  />
                  <ButtonGroup>
                    <RemoveButton
                      role="button"
                      onClick={
                        notesFields.length === 1
                          ? () => {}
                          : () => {
                              const noteId = getValues(`notes.${index}.id`);
                              deleteNote(noteId);
                              removeNote(index);
                            }
                      }
                    >
                      Remove note
                    </RemoveButton>
                    {index === notesFields.length - 1 && (
                      <AddButton
                        role="button"
                        onClick={() =>
                          appendNote({
                            id: "",
                            body: "",
                            createdAt: format(
                              new Date(Date.now()),
                              "dd MMM yyyy"
                            ),
                          })
                        }
                      >
                        Add note
                      </AddButton>
                    )}
                  </ButtonGroup>
                </FormRow>
              ))}
            </div>
            <FormRow>
              <Button
                $variation="secondary"
                type="reset"
                onClick={() => onCloseModal?.()}
              >
                Cancel
              </Button>
              <Button>Add Order</Button>
            </FormRow>
          </div>
        </Form>
      ) : (
        <Spinner />
      )}
    </>
  );
}

export default CreateOrder;
