import { Paper, Text, Timeline } from "@mantine/core";
import { type PackageHistory } from "../../Models/History";
import { formatDate } from "../../Services/date.service";

interface HistoryProps {
  history: PackageHistory[];
}

function TimeLine({ history }: HistoryProps) {
  return (
    <>
      <Paper bg="white" mt={20} radius="md" p={20}>
        <Text fw={500} size="xl" mb={20}>
          Package Journey
        </Text>
        <Timeline
          radius="lg"
          active={history.length - 1}
          lineWidth={5}
          bulletSize={25}
          color="violet"
        >
          {history.map((h, index) => (
            <Timeline.Item title={h.currentStatus} key={index}>
              <Text c="dimmed" size="sm">
                {formatDate(h.updated)}
              </Text>
            </Timeline.Item>
          ))}
        </Timeline>
      </Paper>
    </>
  );
}
export default TimeLine;
