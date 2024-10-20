import { useEffect, useState } from "react";
import styled from "styled-components";
import { useFieldArray, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";

import Spinner from "../../ui/Spinner.tsx";
import FormRow from "../../ui/FormRow.tsx";
import Input from "../../ui/Input.tsx";
import Button from "../../ui/Button.tsx";
import { useGetSingleOrder } from "../../hooks/orders/useGetSingleOrder.ts";
import { Order } from "../../types/ordersTypes.ts";
import Heading from "../../ui/Heading.tsx";

import Row from "../../ui/Row.tsx";
import OrderComDetails from "./OrderComDetails.tsx";

import useUpdateOrder from "../../hooks/orders/useUpdateOrder.ts";
import Textarea from "../../ui/Textarea.tsx";
import { useDeleteNote } from "../../hooks/useDeleteNote.ts";

import { OrderStatus } from "../../assets/mapLists.tsx";
import useGetOrderOptions from "../../hooks/orders/useGetOrderOptions.ts";
import OrderDetailsForm from "./OrderDetailsForm.tsx";
import {
  useAcceptOrder,
  useCancelOrder,
  useEndOrder,
} from "../../hooks/orders/useSetOrderStatus.ts";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5rem;

  & .Form {
    background-color: var(--color-grey-0);
    padding: 2.4rem 4rem;
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);
  }

  & .name {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    & .title {
      font-weight: bold;
      font-size: 2.4rem;
    }
  }
`;
const HeadingGroup = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
`;
const RemoveButton = styled.div`
  background-color: var(--color-red-700);
  cursor: pointer;
  font-size: 1.4rem;
  padding: 0.8rem 1.6rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  color: white;
`;
const AddButton = styled.div`
  background-color: var(--color-brand-600);
  cursor: pointer;
  font-size: 1.4rem;
  padding: 0.8rem 1.6rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  color: white;
`;

function OrderDetails() {
  const { editID } = useLocation().state;
  const { orderDetails, isPending: isFetching } = useGetSingleOrder(editID);
  const { updateOrder, isPending: isEditing } = useUpdateOrder();
  const { acceptOrder, accepting } = useAcceptOrder();
  const { cancelOrder, cancelling } = useCancelOrder();
  const { doneOrder, ending } = useEndOrder();
  const { deleteNote } = useDeleteNote();
  const { anisa } = useGetOrderOptions();
  const [defaultValue, setDefaultValue] = useState(orderDetails?.anisa);

  const InitData = orderDetails && {
    ...orderDetails,
    startDate: format(
      new Date(orderDetails.startDate as string),
      "yyyy-MM-dd'T'HH:mm"
    ),
    endDate: format(
      new Date(orderDetails.endDate as string),
      "yyyy-MM-dd'T'HH:mm"
    ),
    notes: orderDetails.notes,
  };
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState,
    control,
    getValues,
  } = useForm<Order>({
    defaultValues: InitData,
  });

  const { errors } = formState;

  useEffect(() => {
    setDefaultValue(orderDetails?.anisa);

    reset(InitData);

    orderDetails &&
      (!orderDetails.notes || orderDetails.notes.length === 0) &&
      appendNote({
        id: "",
        body: "",
        createdAt: new Date(Date.now()).toString(),
      });
  }, [orderDetails]);

  const {
    fields: notesFields,
    append: appendNote,
    remove: removeNote,
  } = useFieldArray({
    control,
    name: "notes",
  });

  const onSubmit = (data: Order) => {
    updateOrder(
      { id: editID, order: data },
      {
        onSuccess: () => {
          reset({
            ...data,
            startDate: format(
              new Date(data.startDate as string),
              "yyyy-MM-dd'T'HH:mm"
            ),
            endDate: format(
              new Date(data.endDate as string),
              "yyyy-MM-dd'T'HH:mm"
            ),
            notes: data.notes || [
              { id: "", body: "", createdAt: new Date(Date.now()).toString() },
            ],
          });
        },
      }
    );
  };
  if (!defaultValue || isFetching) return <Spinner />;

  const isWorking =
    isFetching || isEditing || accepting || cancelling || ending;
  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Order #{editID}</Heading>
          {orderDetails?.orderStatus === "inProcess" ? (
            <ButtonGroup>
              <AddButton onClick={() => acceptOrder(editID)}>Accept</AddButton>
              <RemoveButton onClick={() => cancelOrder(editID)}>
                Cancel
              </RemoveButton>
            </ButtonGroup>
          ) : orderDetails?.orderStatus === "accepted" ? (
            <ButtonGroup>
              <AddButton onClick={() => doneOrder(editID)}>Done</AddButton>
            </ButtonGroup>
          ) : (
            <></>
          )}
        </HeadingGroup>
        {/* <ButtonText onClick={moveBack}>&larr; Back</ButtonText> */}
      </Row>

      <OrderComDetails orders={orderDetails} />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="name">
          <label className="title">Order Information </label>
          <OrderDetailsForm
            setValue={setValue}
            errors={errors}
            isWorking={isWorking}
            defaultValue={orderDetails.anisa}
            anisa={anisa}
            OrderStatus={OrderStatus}
            register={register}
          />
          <div className="Form">
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
                  disabled={isEditing}
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
                            new Date(field.createdAt),
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
        </div>
        <FormRow>
          <Button
            $variation="secondary"
            type="button"
            onClick={() => {
              reset({
                ...orderDetails,
                startDate: format(
                  new Date(orderDetails.startDate as string),
                  "yyyy-MM-dd'T'HH:mm"
                ),
                endDate: format(
                  new Date(orderDetails.endDate as string),
                  "yyyy-MM-dd'T'HH:mm"
                ),
              });
              setDefaultValue(orderDetails.anisa);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isWorking}>Save</Button>
        </FormRow>
      </Form>
    </>
  );
}

export default OrderDetails;
