import { useForm } from "react-hook-form";
import Input from "../../ui/Input.tsx";
import Form from "../../ui/Form.tsx";
import Button from "../../ui/Button.tsx";
import FormRow from "../../ui/FormRow.tsx";
import { anisaData, errorAnisaValidation } from "../../types/anisaTypes.ts";
import { useCreateAnisa } from "../../hooks/anisas/useCreateAnisa.ts";
import { useUpdateAnisa } from "../../hooks/anisas/useUpdateAnisa.ts";
import Select from "../../ui/SelectOption.tsx";
import FileInput from "../../ui/FileInput.tsx";
import styled from "styled-components";

const Fixed = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 0.5rem;
`;

function CreateAnisaForm({
  anisaToEdit,
  onCloseModal,
}: {
  anisaToEdit?: anisaData;
  onCloseModal?: () => void;
}) {
  const { id: editId, ...editValues } = anisaToEdit || {};
  const isEditSession = Boolean(editId);

  // Set up React Hook Form with initial values for edit mode or empty for create mode
  const { register, handleSubmit, reset, formState } = useForm<anisaData>({
    defaultValues: isEditSession ? { ...editValues } : {},
  });

  const { errors } = formState as errorAnisaValidation;
  const { createAnisa, isPending: isCreating } = useCreateAnisa();
  const { updateAnisa, isPending: isEditing } = useUpdateAnisa(editId ?? "");
  // const { deleteChild } = useDeleteChild();
  const isWorking = isCreating || isEditing;

  const onSubmit = (data: anisaData) => {
    const formData = new FormData() as any;

    // Append form data fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, JSON.stringify(value));
      }
    });

    if (data.image && data.image.length > 0) {
      Array.from(data.image as FileList).forEach((file: File) => {
        formData.append("image", file);
      });
    }

    if (isEditSession && editId !== undefined) {
      updateAnisa(
        { anisa: formData, id: editId },
        {
          onSuccess: () => {
            reset({
              ...data,
              address: data.address ?? [""],
              notes: data.notes || [""],
            });
            onCloseModal?.();
          },
        }
      );
    } else {
      createAnisa(data, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  };
  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={!onCloseModal ? "regular" : "modal"}
    >
      <FormRow label="Anisa name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Anisa Phone" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("phone", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Anisa WhatsApp" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("whatsapp", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Anisa Email" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("email", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Anisa Status" error={errors?.anisaStatus?.message}>
        <Select
          id="anisaStatus"
          disabled={isWorking}
          {...register("anisaStatus", { required: "This field is required" })}
        >
          <option value="active">Active</option>
          <option value="inActive">In Active</option>
          <option value="invacation">Invacation</option>
          <option value="busy">Busy</option>
        </Select>{" "}
      </FormRow>
      <FormRow
        label="Anisa Education"
        error={errors?.graduateOrStudent?.message}
      >
        <Select
          id="educationaStatus"
          disabled={isWorking}
          {...register("graduateOrStudent", {
            required: "This field is required",
          })}
        >
          <option value="graduated">graduated</option>
          <option value="student">Student</option>
        </Select>
      </FormRow>{" "}
      <FormRow label="Anisa Marital " error={errors?.maritalStatus?.message}>
        <Select
          id="maritalStatus"
          disabled={isWorking}
          {...register("maritalStatus", {
            required: "This field is required",
          })}
        >
          <option value="single">single</option>
          <option value="marriedAndHasChildren">Married and have Childs</option>
          <option value="marriedAndHasNoChildren">
            Married and have no Childs
          </option>
        </Select>
      </FormRow>
      <FormRow label="Upload Images">
        <FileInput
          id="image"
          accept="image/*"
          multiple
          {...register("image", {
            required: isEditSession ? false : "Please upload images",
          })}
        />
      </FormRow>
      <Fixed>
        <FormRow>
          <Button
            $variation="secondary"
            type="reset"
            onClick={() => onCloseModal?.()}
          >
            Cancel
          </Button>
          <Button disabled={isWorking}>
            {isEditSession ? "Edit Customer" : "Add Customer"}
          </Button>
        </FormRow>
      </Fixed>
    </Form>
  );
}

export default CreateAnisaForm;
