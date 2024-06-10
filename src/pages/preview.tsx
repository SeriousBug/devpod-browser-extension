import { createRoot } from "react-dom/client";
import "../tailwind.css";
import { Preview } from "./PreviewContent";

const root = createRoot(document.body);
root.render(<Preview />);
