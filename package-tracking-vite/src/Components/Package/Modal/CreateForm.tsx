import {
  Button,
  Container,
  Group,
  Input,
  Modal,
  Text,
  TextInput,
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import "react-phone-number-input/style.css";
import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
  type Value,
} from "react-phone-number-input";
import type { Contact } from "../../../Models/Contact";
import type { CreationProfile } from "../../../Models/CreationProfile";

interface CreateFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: CreationProfile) => void;
}

function CreateForm({ opened, onClose, onSubmit }: CreateFormProps) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      senderName: "",
      senderAddress: "",
      senderPhone: "",
      receiverName: "",
      receiverAddress: "",
      receiverPhone: "",
    },

    validate: {
      senderName: hasLength({ min: 1 }, "Name must be longer"),
      senderAddress: hasLength(
        { min: 5 },
        "Address must be longer than 5 symbols"
      ),
      senderPhone: (value: string) => {
        if (!value) return "Phone number is required";
        return !isValidPhoneNumber(value) ? "Invalid phone number" : null;
      },
      receiverName: hasLength({ min: 1 }, "Name must be longer"),
      receiverAddress: hasLength(
        { min: 5 },
        "Address must be longer than 5 symbols"
      ),
      receiverPhone: (value: string) => {
        if (!value) return "Phone number is required";
        return !isValidPhoneNumber(value) ? "Invalid phone number" : null;
      },
    },
  });
  const handleSubmit = () => {
    const sender: Contact = {
      name: form.values.senderName,
      address: form.values.senderAddress,
      phone: form.values.senderPhone,
    };
    const receiver: Contact = {
      name: form.values.receiverName,
      address: form.values.receiverAddress,
      phone: form.values.receiverPhone,
    };
    const body: CreationProfile = {
      sender: sender,
      recipient: receiver,
    };
    onSubmit(body);
    form.reset();
    onClose();
  };
  return (
    <>
      <Modal
        zIndex={1100}
        opened={opened}
        onClose={onClose}
        title="Package creation"
      >
        <form
          onSubmit={form.onSubmit(() => {
            handleSubmit();
          })}
        >
          <Container mb={20}>
            <Text my={10} fw="bold" size="md">
              Sender information
            </Text>
            <TextInput
              label="Name"
              placeholder="Name"
              withAsterisk
              key={form.key("senderName")}
              {...form.getInputProps("senderName")}
            ></TextInput>
            <TextInput
              label="Address"
              placeholder="Address"
              withAsterisk
              key={form.key("senderAddress")}
              {...form.getInputProps("senderAddress")}
            ></TextInput>
            <Input.Wrapper
              label="Phone"
              withAsterisk
              error={form.errors.senderPhone}
            >
              <PhoneInputWithCountrySelect
                defaultCountry="LT"
                value={form.values.senderPhone}
                onChange={(value: Value) =>
                  form.setFieldValue("senderPhone", value ?? "")
                }
                onBlur={() => form.validateField("senderPhone")}
                className="phone-input"
              />
            </Input.Wrapper>
            <Text my={10} fw="bold" size="md">
              Receiver information
            </Text>
            <TextInput
              label="Name"
              placeholder="Name"
              withAsterisk
              key={form.key("receiverName")}
              {...form.getInputProps("receiverName")}
            ></TextInput>
            <TextInput
              label="Address"
              placeholder="Address"
              withAsterisk
              key={form.key("receiverAddress")}
              {...form.getInputProps("receiverAddress")}
            ></TextInput>
            <Input.Wrapper
              label="Phone"
              withAsterisk
              error={form.errors.receiverPhone}
            >
              <PhoneInputWithCountrySelect
                defaultCountry="LT"
                value={form.getValues().receiverPhone}
                onChange={(value: Value) =>
                  form.setFieldValue("receiverPhone", value ?? "")
                }
                onBlur={() => form.validateField("receiverPhone")}
                className="phone-input"
              />
            </Input.Wrapper>
            <Group justify="flex-end" mt="md">
              <Button type="submit">Create</Button>
            </Group>
          </Container>
        </form>
      </Modal>
    </>
  );
}
export default CreateForm;
