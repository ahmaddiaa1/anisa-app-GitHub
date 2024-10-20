import Form from "../../ui/Form.tsx";
import { useCreateAddress } from "../../hooks/useCreateAddress.ts";
import FormRow from "../../ui/FormRow.tsx";
import Input from "../../ui/Input.tsx";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useAddresses } from "../../hooks/useAddresses.ts";
import { useDeleteAddresses } from "../../hooks/useDeleteAddresses.ts";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

type AddressFormProps = {
  address: string;
};

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
`;

const RemoveButton = styled.button`
  background-color: var(--color-red-700);
  cursor: pointer;
  font-size: 1.4rem;
  padding: 0.8rem 1.6rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  color: white;
  border: none;
`;

const AddButton = styled.button`
  background-color: var(--color-brand-600);
  cursor: pointer;
  font-size: 1.4rem;
  padding: 0.8rem 1.6rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  color: white;
  border: none;
`;

const AddressForm = () => {
  const queryClient = useQueryClient();

  const { createAddress, isPending: isCreating } = useCreateAddress();
  const { deleteAddresses, isPending: isDeleting } = useDeleteAddresses();
  const { addresses, isPending: isFetching } = useAddresses();

  const { register, handleSubmit, reset, watch } = useForm<AddressFormProps>();
  const [isExisting, setIsExisting] = useState(false);

  const currentAddress = watch("address");

  useEffect(() => {
    const addressExists = addresses.some(
      (addr: AddressFormProps) => addr.address === currentAddress
    );
    setIsExisting(addressExists);
  }, [currentAddress, addresses]);

  const isWorking = isCreating || isDeleting || isFetching;

  const onSubmit = (data: AddressFormProps) => {
    const addressData = queryClient.getQueryCache().get("addresses")?.state
      .data as AddressFormProps[];
    const addressExists = addressData?.some(
      (addr: { address: string }) => addr.address === data.address
    );

    if (!addressExists) {
      createAddress(data, {
        onSuccess: () => {
          reset();
        },
      });
    } else {
      setIsExisting(true);
    }
  };

  // Address removal handler
  const handleDeleteAddress = () => {
    const addressToDelete = addresses.find(
      (addr: AddressFormProps) => addr.address === currentAddress
    );
    if (addressToDelete) {
      deleteAddresses(addressToDelete.id, {
        onSuccess: () => {
          reset();
        },
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="address">
        <Input
          type="text"
          id="address"
          disabled={isWorking}
          {...register("address", { required: true })}
        />
      </FormRow>

      <FormRow>
        <ButtonGroup>
          {isExisting ? (
            <RemoveButton role="button" onClick={handleDeleteAddress}>
              Remove address
            </RemoveButton>
          ) : (
            <AddButton role="button">Add address</AddButton>
          )}
        </ButtonGroup>
      </FormRow>
    </Form>
  );
};

export default AddressForm;
