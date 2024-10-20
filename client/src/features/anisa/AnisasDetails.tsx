import { useFieldArray, useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import SelectOption from "../../ui/SelectOption.tsx";
import FileInput from "../../ui/FileInput.tsx";
import Spinner from "../../ui/Spinner.tsx";
import FormRow from "../../ui/FormRow.tsx";
import Input from "../../ui/Input.tsx";
import { anisaData, errorAnisaValidation } from "../../types/anisaTypes.ts";
import { useGetSingleAnisa } from "../../hooks/anisas/useGetSingleAnisa.ts";
import { useUpdateAnisa } from "../../hooks/anisas/useUpdateAnisa.ts";
import Button from "../../ui/Button.tsx";
import { useDeleteAddress } from "../../hooks/useDeleteAddress.ts";
import { downloadAnisaPdf } from "../../services/apiAnisa.ts";
import { HiArrowDownOnSquare, HiXMark } from "react-icons/hi2";
import { format } from "date-fns";
import { useUser } from "../../hooks/users/useUser.ts";
import SelectSearch from "../../ui/SelectSearchT.tsx";
import { useAddresses } from "../../hooks/useAddresses.ts";

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
  }

  & .title {
    font-weight: bold;
    font-size: 2.4rem;
  }

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
  }
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

function AnisaDetails() {
  const { anisaID } = useLocation().state;
  const { anisaDetails, fetchData } = useGetSingleAnisa(anisaID);
  const { updateAnisa, isPending: isEditing } = useUpdateAnisa(anisaID);
  const [isLoading, setIsLoading] = useState(true);

  const [media, setMedia] = useState(anisaDetails?.multiMedia || []);
  const [mediaToRemove, setMediaToRemove] = useState<string[]>([]);

  const { notModerator } = useUser();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState,
    getValues,
    setValue,
  } = useForm<anisaData>({
    defaultValues: anisaDetails && {
      ...anisaDetails,
      address: anisaDetails.address?.length
        ? anisaDetails.address
        : [{ id: "", address: "", createdAt: "" }],
    },
  });

  const { deleteAddress } = useDeleteAddress();
  const { addresses } = useAddresses();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newMedia = Array.from(files).map((file: File) =>
        URL.createObjectURL(file)
      );
      setMedia((prevMedia: string[]) => [...prevMedia, ...newMedia]);
    }
  };

  useEffect(() => {
    if (anisaDetails) {
      reset({
        ...anisaDetails,
        address: anisaDetails.address?.length
          ? anisaDetails.address
          : [{ id: "", address: "", createdAt: "" }],
      });
      setIsLoading(false);
    }
    if (anisaDetails?.multiMedia) {
      setMedia(anisaDetails.multiMedia);
    }
  }, [anisaDetails]);

  const { errors } = formState as errorAnisaValidation;
  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control,
    name: "address",
  });

  const onSubmit = (data: anisaData) => {
    const formData = new FormData();

    // Append form data fields

    formData.append("fullName", data.fullName);
    formData.append("phone", data.phone);
    formData.append("whatsapp", data.whatsapp);
    formData.append("email", data.email);
    formData.append("anisaStatus", data.anisaStatus);
    formData.append("graduateOrStudent", data.graduateOrStudent);
    formData.append("maritalStatus", data.maritalStatus);
    formData.append("mediaToRemove", JSON.stringify(mediaToRemove));

    const addressData = data.address.map((address) => ({
      id: address.id,
      address: address.address,
      createdAt: address.createdAt,
    }));
    formData.append("address", JSON.stringify(addressData));

    if (data.image && data.image.length > 0) {
      Array.from(data.image as FileList).forEach((file: File) => {
        formData.append("image", file);
      });
    }

    updateAnisa(
      { anisa: formData, id: anisaID },
      {
        onSuccess: () => {
          reset({
            ...data,
            address: data.address?.length
              ? data.address
              : [
                  {
                    id: "",
                    address: "",
                    createdAt: "",
                  },
                ],
          });
        },
      }
    );
  };

  const removeMedia = (index: number) => {
    const updatedMedia = [...media];
    const mediaUrlToRemove = updatedMedia[index];
    updatedMedia.splice(index, 1);

    setMedia(updatedMedia);
    setMediaToRemove((prev) => [...prev, mediaUrlToRemove]);
  };

  if (isLoading || fetchData) return <Spinner />;
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="name">
        <label className="title">Anisa Information </label>
        <div className="Form">
          <FormRow label="Anisa name" error={errors?.fullName?.message}>
            <Input
              type="text"
              id="name"
              disabled={true}
              {...register("fullName", { required: "This field is required" })}
            />
          </FormRow>
          <FormRow label="Anisa Phone" error={errors?.phone?.message}>
            <Input
              type="text"
              id="phone"
              disabled={notModerator ? isEditing : true}
              {...register("phone", { required: "This field is required" })}
            />
          </FormRow>
          <FormRow label="Anisa WhatsApp" error={errors?.whatsapp?.message}>
            <Input
              type="text"
              id="whatsapp"
              disabled={notModerator ? isEditing : true}
              {...register("whatsapp", { required: "This field is required" })}
            />
          </FormRow>
          <FormRow label="Anisa Email" error={errors?.email?.message}>
            <Input
              type="text"
              id="email"
              disabled={notModerator ? isEditing : true}
              {...register("email", { required: "This field is required" })}
            />
          </FormRow>
          <FormRow label="Anisa Status" error={errors?.anisaStatus?.message}>
            <SelectOption
              id="anisaStatus"
              disabled={isEditing}
              {...register("anisaStatus", {
                required: "This field is required",
              })}
            >
              <option value="active">Active</option>
              <option value="inActive">In Active</option>
              <option value="invacation">In vacation</option>
              <option value="busy">Busy</option>
            </SelectOption>
          </FormRow>
          <FormRow
            label="Anisa Education"
            error={errors?.graduateOrStudent?.message}
          >
            <SelectOption
              id="educationaStatus"
              disabled={isEditing}
              {...register("graduateOrStudent", {
                required: "This field is required",
              })}
            >
              <option value="graduated">Graduated</option>
              <option value="student">Student</option>
            </SelectOption>
          </FormRow>
          <FormRow label="Anisa Marital" error={errors?.maritalStatus?.message}>
            <SelectOption
              id="maritalStatus"
              disabled={isEditing}
              {...register("maritalStatus", {
                required: "This field is required",
              })}
            >
              <option value="single">Single</option>
              <option value="marriedAndHasChildren">
                Married and has Children
              </option>
              <option value="marriedAndHasNoChildren">
                Married and has no Children
              </option>
            </SelectOption>
          </FormRow>
          <FormRow label="Upload Images">
            <FileInput
              id="image"
              accept="image/*"
              disabled={notModerator ? isEditing : true}
              multiple
              {...register("image")}
              onChange={handleImageUpload}
            />
          </FormRow>

          <div
            style={{
              display: "flex",
              gap: "2rem",
              marginTop: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {anisaDetails?.multiMedia &&
              media.map((media: string, index: number) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                  }}
                >
                  <Link to={media} target="_blank">
                    <img
                      src={media}
                      alt={`Media ${index + 1}`}
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                  {notModerator && (
                    <Button
                      type="button"
                      onClick={() => removeMedia(index)}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-5px",
                        backgroundColor: "red",
                        color: "white",
                        padding: "0.5rem",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      <HiXMark
                        style={{
                          fontSize: "2rem",
                          color: "white",
                        }}
                      />
                    </Button>
                  )}
                </div>
              ))}
          </div>

          <FormRow>
            <Button
              onClick={() => downloadAnisaPdf(anisaDetails.id)}
              type="button"
            >
              Download Pdf <HiArrowDownOnSquare />
            </Button>
          </FormRow>
        </div>
      </div>
      <div className="Form">
        {addressFields.map((field, index) => (
          <FormRow
            label={`Address ${index + 1}`}
            key={field.id}
            error={errors?.address?.[index]?.message}
            createdAt={
              field.createdAt
                ? format(new Date(field.createdAt), "dd MMM yyyy")
                : ""
            }
          >
            <Input type="hidden" {...register(`address.${index}.id`)} />
            <SelectSearch
              fieldName={`address.${index}.address`}
              defaultValue={anisaDetails?.address[index]}
              valueField={"address"}
              labelField={"address"}
              setValues={setValue}
              disabled={isEditing}
              options={addresses}
            />
            <ButtonGroup>
              {notModerator && (
                <RemoveButton
                  role="button"
                  onClick={
                    addressFields.length === 1
                      ? () => {}
                      : () => {
                          const addressId = getValues(`address.${index}.id`);
                          removeAddress(index);
                          deleteAddress(addressId);
                        }
                  }
                >
                  Remove address
                </RemoveButton>
              )}
              {index === addressFields.length - 1 && (
                <AddButton
                  role="button"
                  onClick={() =>
                    appendAddress({ id: "", address: "", createdAt: "" })
                  }
                >
                  Add address
                </AddButton>
              )}
            </ButtonGroup>
          </FormRow>
        ))}
      </div>
      <FormRow>
        <Button $variation="secondary" type="button" onClick={() => reset()}>
          Cancel
        </Button>
        <Button disabled={isEditing}>Save</Button>{" "}
      </FormRow>
    </Form>
  );
}

export default AnisaDetails;
