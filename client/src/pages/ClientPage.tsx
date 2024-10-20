import styled from "styled-components";
import {errorValidation, formDataProps} from "../types/types.ts";
import {useFieldArray, useForm} from "react-hook-form";
import {format} from "date-fns";
import {useUpdateClient} from "../hooks/clients/useUpdateClient.ts";
import {useDeleteChild} from "../hooks/useDeleteChild.ts";
import FormRow from "../ui/FormRow.tsx";
import Input from "../ui/Input.tsx";
import Textarea from "../ui/Textarea.tsx";
import FileInput from "../ui/FileInput.tsx";
import Button from "../ui/Button.tsx";
import {Link, useLocation} from "react-router-dom";
import {HiArrowDownOnSquare, HiXMark} from "react-icons/hi2";
import {downloadPdf} from "../services/apiClient.ts";
import {useDeleteAddress} from "../hooks/useDeleteAddress.ts";
import {useDeleteNote} from "../hooks/useDeleteNote.ts";
import {useClient} from "../hooks/clients/useClient.ts";
import {useEffect, useState} from "react";
import {useAddresses} from "../hooks/useAddresses.ts";
import Spinner from "../ui/Spinner.tsx";
import {useUser} from "../hooks/users/useUser.ts";
import SelectSearch from "../ui/SelectSearchT.tsx";

const ClientForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 5rem;

    & .Form {
        padding: 2.4rem 4rem;
        /* Box */
        background-color: var(--color-grey-0);
        border: 1px solid var(--color-grey-100);
        border-radius: var(--border-radius-md);
    }
`;

const Child = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

const AgeInput = styled.input`
    border: 1px solid var(--color-grey-300);
    background-color: var(--color-grey-0);
    border-radius: var(--border-radius-sm);
    box-shadow: var(--shadow-sm);
    padding: 0.8rem 1.2rem;
    width: 12rem;
`;

const SpecialChild = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 12px;
    width: 12rem;
`;

const SpecialChildInput = styled.input.attrs({type: "checkbox"})`
    appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid var(--color-grey-300);
    border-radius: 0.25rem;
    background-color: var(--color-grey-0);
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:checked {
        background-color: var(--color-brand-600);
        border-color: var(--color-brand-600);
        position: relative;
    }

    &:checked::before {
        content: "✔";
        color: white;
        font-size: 1rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    &:hover {
        border-color: var(--color-grey-500);
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px var(--shadow-sm);
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


function ClientPage({onCloseModal}: { onCloseModal?: () => void }) {
    const {clientID} = useLocation().state;
    const {client, isPending: isFetching} = useClient(clientID);
    const {addresses} = useAddresses();

    const [media, setMedia] = useState(client?.multiMedia || []);
    const [mediaToRemove, setMediaToRemove] = useState<string[]>([]);


    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState,
        control,
        setValue,
    } = useForm<formDataProps>({
        defaultValues: client && {
            ...client,
            children: client.children?.length
                ? client.children
                : [{id: "", name: "", age: "", specialChild: false, createdAt: ""}],
            orderDate: client.orderDate
                ? format(new Date(client.orderDate), "yyyy-MM-dd'T'HH:mm")
                : "",
            address: client.address?.length
                ? client.address
                : [{id: "", address: "", createdAt: ""}],
            notes: client.notes?.length
                ? client.notes
                : [{id: "", body: "", createdAt: ""}],
        },
    });

    useEffect(() => {
        if (client) {
            const resetData = {
                ...client,
                children: client.children?.length
                    ? client.children
                    : [{id: "", name: "", age: "", specialChild: false, createdAt: ""}],
                orderDate: client.orderDate
                    ? format(new Date(client.orderDate), "yyyy-MM-dd'T'HH:mm")
                    : "",
                address: client.address?.length
                    ? client.address
                    : [{id: "", address: "", createdAt: ""}],
                notes: client.notes?.length
                    ? client.notes
                    : [{id: "", body: "", createdAt: ""}],
            };

            // Only reset if the resetData is different from the current values
            if (JSON.stringify(resetData) !== JSON.stringify(getValues())) {
                reset(resetData);
            }

            // Update media only if it changes
            if (client?.multiMedia) {
                setMedia(client.multiMedia);
            }
        }
    }, [client, reset, getValues]);


    const {errors} = formState as errorValidation;
    const {updateClient, isPending: isEditing} = useUpdateClient(clientID);
    const {deleteChild} = useDeleteChild();
    const {deleteAddress} = useDeleteAddress();
    const {deleteNote} = useDeleteNote();
    const isWorking = isEditing;

    const {fields: childFields, append, remove} = useFieldArray({
        control,
        name: "children",
    });

    const {notModerator} = useUser();

    const {
        fields: addressFields,
        append: appendAddress,
        remove: removeAddress,
    } = useFieldArray({
        control,
        name: "address",
    });

    const {
        fields: notesFields,
        append: appendNote,
        remove: removeNote,
    } = useFieldArray({
        control,
        name: "notes",
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newMedia = Array.from(files).map((file: File) =>
                URL.createObjectURL(file)
            );
            setMedia((prevMedia: string[]) => [...prevMedia, ...newMedia]);
        }
    };

    const onSubmit = (data: formDataProps) => {
        const formData = new FormData() as any;

        formData.append("fullName", data.fullName);
        formData.append("phone", data.phone);
        formData.append("whatsapp", data.whatsapp);
        formData.append("childrenNum", data.childrenNum);
        formData.append("orderDate", data.orderDate);
        formData.append("childNote", data.childNote);
        formData.append("fromHour", data.fromHour);
        formData.append("toHour", data.toHour);
        formData.append("whoStaysWithAnisa", data.whoStaysWithAnisa);
        formData.append("pdfUrl", data.pdfUrl);
        formData.append("isVerified", data.isVerified);
        formData.append("outInHome", data.outInHome);

        const notesData = data.notes.map((note) => ({
            id: note.id,
            body: note.body,
            createdAt: note.createdAt,
        }));
        formData.append("notes", JSON.stringify(notesData));

        const childrenData = data.children.map((child) => ({
            id: child.id,
            name: child.name,
            age: child.age,
            specialChild: child.specialChild,
        }));
        formData.append("children", JSON.stringify(childrenData));

        const addressData = data.address.map((address) => ({
            id: address.id,
            address: address.address,
            crateAt: address.createdAt,
        }));
        formData.append("address", JSON.stringify(addressData));

        formData.append("mediaToRemove", JSON.stringify(mediaToRemove));

        if (data.image && data.image.length > 0) {
            Array.from(data.image as FileList).forEach((file: File) => {
                formData.append("image", file);
            });
        }

        if (client.id !== undefined) {
            updateClient(
                {client: formData, id: client.id},
                {
                    onSuccess: () => {
                        reset({
                            ...data,
                            children: data.children || [
                                {id: "", name: "", age: "", specialChild: false},
                            ],
                            address: data.address || [
                                {
                                    id: "",
                                    address: "",
                                },
                            ],
                            orderDate: data.orderDate || "",
                            notes: data.notes || [{id: "", body: ""}],
                        });

                        onCloseModal?.();
                    },
                }
            );
        }
    };

    const removeMedia = (index: number) => {
        const updatedMedia = [...media];
        const mediaUrlToRemove = updatedMedia[index];
        updatedMedia.splice(index, 1);

        setMedia(updatedMedia);
        setMediaToRemove((prev) => [...prev, mediaUrlToRemove]);
    };

    if (isFetching) return <Spinner/>;


    return (
        <ClientForm onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="Form">
                <FormRow label="Client name" error={errors?.fullName?.message}>
                    <Input
                        type="text"
                        id="fullName"
                        disabled={true}
                        {...register("fullName", {required: "This field is required"})}
                    />
                </FormRow>

                <FormRow label="Phone number" error={errors?.phone?.message}>
                    <Input
                        type="text"
                        id="phone"
                        disabled={notModerator ? isWorking : true}
                        {...register("phone", {
                            required: "This field is required",
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "Phone number must be numeric",
                            },
                        })}
                    />
                </FormRow>

                <FormRow label="Whatsapp number" error={errors?.whatsapp?.message}>
                    <Input
                        type="text"
                        id="whatsapp"
                        disabled={notModerator ? isWorking : true}
                        {...register("whatsapp", {
                            required: "This field is required",
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "Whatsapp number must be numeric",
                            },
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

                <FormRow label="Upload Images">
                    <FileInput
                        id="image"
                        accept="image/*"
                        multiple
                        disabled={notModerator ? isWorking : true}
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
                    {client?.multiMedia &&
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
                    <Button onClick={() => downloadPdf(client.id)} type="button">
                        Download Pdf <HiArrowDownOnSquare/>
                    </Button>
                </FormRow>
            </div>

            <div className="Form children">
                {childFields.map((field, index) => (
                    <FormRow
                        label={`Children ${index + 1}`}
                        key={field.id}
                        createdAt={
                            field.createdAt
                                ? format(new Date(field.createdAt), "dd MMM yyyy")
                                : ""
                        }
                    >
                        <Child>
                            <input type="hidden" {...register(`children.${index}.id`)} />
                            <Input
                                type="text"
                                id={`children[${index}].name`}
                                placeholder="Child Name"
                                disabled={isWorking}
                                {...register(`children.${index}.name`, {
                                    required: "Child name is required",
                                })}
                            />
                            <AgeInput
                                type="number"
                                id={`children[${index}].age`}
                                placeholder="Child Age"
                                disabled={isWorking}
                                {...register(`children.${index}.age`, {
                                    required: "Child age is required",
                                    min: 0,
                                })}
                            />
                            <SpecialChild>
                                <label htmlFor={`children[${index}].specialChild`}>
                                    Special Child
                                </label>
                                <SpecialChildInput
                                    type="checkbox"
                                    id={`children[${index}].specialChild`}
                                    defaultChecked={getValues(`children.${index}.specialChild`)} // Set the initial value
                                    disabled={isWorking}
                                    {...register(`children.${index}.specialChild`, {
                                        setValueAs: (value) => value === true,
                                    })}
                                />
                            </SpecialChild>
                        </Child>
                        <ButtonGroup>
                            {notModerator && (
                                <RemoveButton
                                    role={"button"}
                                    onClick={() => {
                                        const childId = getValues(`children.${index}.id`);
                                        if (childId) {
                                            deleteChild({childId}); // Use actual child ID from form
                                        }
                                        remove(index);
                                    }}
                                >
                                    Remove child
                                </RemoveButton>
                            )}
                            {index === childFields.length - 1 && (
                                <AddButton
                                    role="button"
                                    onClick={() =>
                                        append({
                                            id: "",
                                            name: "",
                                            age: "",
                                            specialChild: false,
                                            createdAt: format(
                                                new Date(field.createdAt),
                                                "dd MMM yyyy"
                                            ),
                                        })
                                    }
                                >
                                    Add child
                                </AddButton>
                            )}
                        </ButtonGroup>
                    </FormRow>
                ))}
            </div>

            <div className="Form address">
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
                            defaultValue={client?.address[index]}
                            valueField={"address"}
                            labelField={"address"}
                            setValues={setValue}
                            disabled={isWorking}
                            options={addresses}
                        />
                        <ButtonGroup>
                            {notModerator && (
                                <RemoveButton
                                    role="button"
                                    onClick={
                                        addressFields.length === 1
                                            ? () => {
                                            }
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
                                        appendAddress({
                                            id: "",
                                            address: "",
                                            createdAt: format(
                                                new Date(field.createdAt),
                                                "dd MMM yyyy"
                                            ),
                                        })
                                    }
                                >
                                    Add address
                                </AddButton>
                            )}
                        </ButtonGroup>
                    </FormRow>
                ))}
            </div>

            <div className="Form notes">
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
                            disabled={isWorking}
                            {...register(`notes.${index}.body`, {
                                required: "This field is required",
                            })}
                        />
                        <ButtonGroup>
                            {notModerator && (
                                <RemoveButton
                                    role="button"
                                    onClick={
                                        notesFields.length === 1
                                            ? () => {
                                            }
                                            : () => {
                                                const noteId = getValues(`notes.${index}.id`);
                                                deleteNote(noteId);
                                                removeNote(index);
                                            }
                                    }
                                >
                                    Remove note
                                </RemoveButton>
                            )}
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

            <FormRow>
                <Button
                    $variation="secondary"
                    type={"button"}
                    onClick={() => {
                        reset({
                            ...client,
                            children: client.children?.length
                                ? client.children
                                : [
                                    {
                                        id: "",
                                        name: "",
                                        age: "",
                                        specialChild: false,
                                        createdAt: "",
                                    },
                                ],
                            orderDate: client.orderDate
                                ? format(new Date(client.orderDate), "yyyy-MM-dd'T'HH:mm")
                                : "",
                            address: client.address?.length
                                ? client.address
                                : [{id: "", address: "", createdAt: ""}],
                            notes: client.notes?.length
                                ? client.notes
                                : [{id: "", body: "", createdAt: ""}],
                        });
                        setMedia(client?.multiMedia || []);
                        onCloseModal?.();
                    }}
                >
                    Cancel
                </Button>
                <Button disabled={isWorking}>{isWorking ? "Saving..." : "Save"}</Button>
            </FormRow>
        </ClientForm>
    );
}

export default ClientPage;
