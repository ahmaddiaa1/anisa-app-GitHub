import {useFieldArray, useForm} from "react-hook-form";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";
import {errorValidation, formDataProps} from "../../types/types.ts";
import {useCreateClient} from "../../hooks/clients/useCreateClient.ts";

import styled from "styled-components";

import Textarea from "../../ui/Textarea.tsx";
import {format} from "date-fns";

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
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

function CreateClientFrom({onCloseModal}: { onCloseModal?: () => void }) {
    const {register, handleSubmit, reset, formState, control} =
        useForm<formDataProps>({
            defaultValues: {
                address: [{id: "", address: ""}],
            },
        });

    const {errors} = formState as errorValidation;
    const {createClient, isPending: isCreating} = useCreateClient();

    const isWorking = isCreating;

    const {
        fields: addressFields,
        append: appendAddress,
        remove: removeAddress,
    } = useFieldArray({
        control,
        name: "address",
    });

    const onSubmit = (data: formDataProps) => {
        const formData = new FormData();

        formData.append("fullName", data.fullName);
        formData.append("phone", data.phone);
        formData.append("whatsapp", data.whatsapp);
        formData.append("orderDate", data.orderDate.toString());
        formData.append("childNote", data.childNote);
        formData.append("fromHour", data.fromHour);
        formData.append("toHour", data.toHour);
        formData.append("whoStaysWithAnisa", data.whoStaysWithAnisa);
        formData.append("outInHome", data.outInHome);

        const addressData = data.address.map((address) => ({
            address: address.address,
        }));
        formData.append("address", JSON.stringify(addressData));

        createClient(formData, {
            onSuccess: () => {
                reset();
                onCloseModal?.();
            },
        });
    };

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            type={!onCloseModal ? "regular" : "modal"}
        >
            <FormRow label="Client name" error={errors?.fullName?.message}>
                <Input
                    type="text"
                    id="fullName"
                    disabled={isWorking}
                    {...register("fullName", {required: "This field is required"})}
                />
            </FormRow>

            <FormRow label="Phone number" error={errors?.phone?.message}>
                <Input
                    type="text"
                    id="phone"
                    disabled={isWorking}
                    {...register("phone", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow label="Whatsapp number" error={errors?.whatsapp?.message}>
                <Input
                    type="text"
                    id="whatsapp"
                    disabled={isWorking}
                    {...register("whatsapp", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow label="Children Notes" error={errors?.childNote?.message}>
                <Textarea
                    id="childNote"
                    disabled={isWorking}
                    {...register("childNote", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow label="From To Hour" error={errors?.fromHour?.message}>
                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                    }}
                >
                    <label
                        style={{
                            fontSize: "1.4rem",
                            fontWeight: 500,
                        }}
                    >
                        from
                    </label>
                    <Input
                        type="text"
                        id="fromHour"
                        disabled={isWorking}
                        size="medium"
                        {...register("fromHour", {
                            required: "This field is required",
                        })}
                    />
                    <label
                        style={{
                            fontSize: "1.4rem",
                            fontWeight: 500,
                        }}
                    >
                        to
                    </label>
                    <Input
                        type="text"
                        id="toHour"
                        size="medium"
                        disabled={isWorking}
                        {...register("toHour", {
                            required: "This field is required",
                        })}
                    />
                </div>
            </FormRow>

            <FormRow label="Out In Home" error={errors?.outInHome?.message}>
                <Input
                    type="text"
                    id="outInHome"
                    disabled={isWorking}
                    {...register("outInHome", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow
                label="Who Stays With Anisa"
                error={errors?.whoStaysWithAnisa?.message}
            >
                <Input
                    type="text"
                    id="whoStaysWithAnisa"
                    disabled={isWorking}
                    {...register("whoStaysWithAnisa", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow label="Order Date" error={errors?.orderDate?.message}>
                <Input
                    type="datetime-local"
                    id="orderDate"
                    disabled={isWorking}
                    {...register("orderDate", {required: "This field is required"})}
                />
            </FormRow>

            {addressFields.map((field, index) => (
                <FormRow
                    label={`Address ${index + 1}`}
                    key={field.id}
                    error={errors?.address?.[index]?.message}
                >
                    <Input type={"hidden"} {...register(`address.${index}.id`)} />
                    <Input
                        type="text"
                        id={`address[${index}].address`}
                        placeholder={`Address ${index + 1}`}
                        disabled={isWorking}
                        {...register(`address.${index}.address`, {
                            required: "This field is required",
                        })}
                    />
                    <ButtonGroup>
                        <RemoveButton
                            role="button"
                            onClick={index === 0 ? () => {
                            } : () => removeAddress(index)}
                        >
                            Remove
                        </RemoveButton>
                        {index === addressFields.length - 1 && (
                            <AddButton
                                role="button"
                                onClick={() =>
                                    appendAddress({
                                        id: "",
                                        address: "",
                                        createdAt: format(new Date(), "yyyy-MM-dd "),
                                    })
                                } // Append an empty string for new address
                            >
                                Add
                            </AddButton>
                        )}
                    </ButtonGroup>
                </FormRow>
            ))}

            <FormRow>
                <Button
                    $variation="secondary"
                    type="reset"
                    onClick={() => onCloseModal?.()}
                >
                    Cancel
                </Button>
                <Button disabled={isWorking}>Add Client</Button>
            </FormRow>
        </Form>
    );
}

export default CreateClientFrom;
