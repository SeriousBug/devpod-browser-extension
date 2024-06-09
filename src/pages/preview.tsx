import { attachShadow } from "@lib/utils/dom/shadow";
import { createRoot } from "react-dom/client";
import { CloneButton } from "./content/CloneButton";

function init() {
  const { shadow: rootContainer } = attachShadow(
    document.getElementById("root"),
  );
  const { shadow: portalContainer } = attachShadow(document.body);
  const root = createRoot(rootContainer);

  root.render(<CloneButton portal={portalContainer} />);
}

init();
