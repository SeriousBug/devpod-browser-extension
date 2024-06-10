import { Button } from "@lib/components/Button";
import { CloneButton } from "./content/CloneButton";

export function Preview() {
  return (
    <div className="w-full min-h-svh top-0 absolute flex justify-center items-center bg-slate-200">
      <div className="m-4 bg-white p-8 rounded flex flex-col gap-4">
        <CloneButton portal={document.body} />
        <Button>Test</Button>
      </div>
    </div>
  );
}
