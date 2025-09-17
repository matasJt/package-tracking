import { Button, Flex, Menu, Paper, TextInput } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import {
  IconCancel,
  IconCheck,
  IconFilter,
  IconPlus,
  IconSend,
  IconTruckReturn,
} from "@tabler/icons-react";

interface ActionBarProps {
  open: () => void;
  onChangeFilter: (status: string) => void;
  onResetFilter: () => void;
  onSetSearchValue: (value: string) => void;
  onPressEnter: () => void;
}

function ActionBar({
  open,
  onChangeFilter,
  onResetFilter,
  onSetSearchValue,
  onPressEnter,
}: ActionBarProps) {
  const statuses = [
    { value: "Cancelled", icon: <IconCancel /> },
    { value: "Returned", icon: <IconTruckReturn /> },
    { value: "Accepted", icon: <IconCheck /> },
    { value: "Created", icon: <IconPlus /> },
    { value: "Sent", icon: <IconSend /> },
  ];
  return (
    <Paper bg="white" radius="md" mt={20} mb={40} p={20}>
      <Flex w="100%" gap={10} align="center">
        <Button size="sm" radius="sm" color="green" onClick={open}>
          <IconPlus />
          Create Package
        </Button>
        <Menu>
          <Menu.Target>
            <Button size="sm" radius="sm">
              <IconFilter />
              Filter by status
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {statuses.map((status, index) => (
              <Menu.Item
                key={index}
                onClick={() => onChangeFilter(status.value)}
              >
                <Flex>
                  {status.icon}
                  {status.value}
                </Flex>
              </Menu.Item>
            ))}
            <Menu.Item onClick={onResetFilter}>Reset</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <TextInput
          size="md"
          placeholder="Filter by tracking number"
          onChange={(event) => onSetSearchValue(event.target.value)}
          onKeyDown={getHotkeyHandler([["Enter", onPressEnter]])}
        />
      </Flex>
    </Paper>
  );
}
export default ActionBar;
