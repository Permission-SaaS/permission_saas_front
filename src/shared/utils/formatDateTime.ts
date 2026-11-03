const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export const formatDateTime = (isoDate: string) =>
  dateTimeFormatter.format(new Date(isoDate));
