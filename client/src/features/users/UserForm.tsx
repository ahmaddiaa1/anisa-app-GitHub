import Form from "../../ui/Form.tsx";
import { useForm } from "react-hook-form";
import FormRow from "../../ui/FormRow.tsx";
import Input from "../../ui/Input.tsx";
import { useUpdateUser } from "../../hooks/users/useUpdateUser.ts";
import Button from "../../ui/Button.tsx";
import { UserProps } from "../../types/types.ts";
import SelectOption from "../../ui/SelectOption.tsx";
import { useCreateUser } from "../../hooks/users/useCreateUser.ts";

const UserFrom = ({
  dataToEdit,
  onCloseModal,
}: {
  dataToEdit?: Partial<UserProps>;
  onCloseModal?: () => void;
}) => {
  const { id: editId, ...editValues } = dataToEdit || {};
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset } = useForm<UserProps>({
    defaultValues: isEditSession ? { ...editValues } : {},
  });

  const { updateUser, isPending: isEditing } = useUpdateUser();
  const { createUser, isPending: isCreating } = useCreateUser();

  const isWorking = isEditing || isCreating;

  const onSubmit = (data: UserProps) => {
    if (isEditSession && editId !== undefined) {
      updateUser(
        { user: data, id: editId },
        {
          onSettled: () => {
            reset(data);
            onCloseModal?.();
          },
          onError: (error) => {
            console.log(`Error: ${error.message}`);
          },
        }
      );
    } else {
      createUser(data, {
        onSettled: () => {
          reset(data);
          onCloseModal?.();
        },
        onError: (error) => {
          console.log(`Error: ${error.message}`);
        },
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="username">
        <Input
          type="text"
          id="username"
          disabled={isWorking}
          {...register("username", { required: true })}
        />
      </FormRow>
      <FormRow label="email">
        <Input
          type="text"
          id="email"
          disabled={isWorking}
          {...register("email", { required: true })}
        />
      </FormRow>

      {isEditSession ? null : (
        <>
          <FormRow label="password">
            <Input
              type="text"
              id="password"
              disabled={isWorking}
              {...register("password")}
            />
          </FormRow>
          <FormRow label="confirm password">
            <Input
              type="text"
              id="confirmPassword"
              disabled={isWorking}
              {...register("confirmPassword")}
            />
          </FormRow>
        </>
      )}
      <FormRow label="role">
        <SelectOption
          id="role"
          disabled={isWorking}
          {...register("role", { required: true })}
        >
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="supervisor">Supervisor</option>
        </SelectOption>
      </FormRow>

      <FormRow label="IsCancelled">
        <SelectOption
          id="role"
          disabled={isWorking}
          {...register("isCanceled", { required: true })}
        >
          <option value="true">cancel</option>
          <option value="false">backRole</option>
        </SelectOption>
      </FormRow>

      <FormRow>
        <Button disabled={isWorking}>
          {isEditSession ? "Update user" : "Add user"}
        </Button>
      </FormRow>
    </Form>
  );
};

export default UserFrom;
