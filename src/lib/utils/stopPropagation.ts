import { EventHandler, SyntheticEvent } from "react";

export const stopPropagation: EventHandler<SyntheticEvent<unknown, Event>> = (
  e,
) => {
  e.stopPropagation();
};
