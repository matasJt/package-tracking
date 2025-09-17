export const formatDate = (date: string) => {
    const created = new Date(date);
    const formatDate = created.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    return formatDate;
  };
