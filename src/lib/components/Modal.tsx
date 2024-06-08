import { AnimatePresence, motion } from "framer-motion";
import { stopPropagation } from "@lib/utils/dom/stopPropagation";
import { clsx } from "@lib/utils/clsx";
import {
  ModalKey,
  useModalDismissed,
} from "@lib/hooks/storage/useModalDismissed";
import { ReactNode, Suspense } from "react";
import { Button } from "./Button";

const MODAL = "fixed left-0 top-0 bottom-0 right-0 z-20";

type ModalDismissableProps = {
  key: ModalKey;
  allowDismiss: true;
};
type ModalNonDismissableProps = {
  allowDismiss?: false;
};

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
} & (ModalDismissableProps | ModalNonDismissableProps);

function Modal(props: ModalProps): ReactNode {
  // Hide the modal until we can figure out if it was dismissed or not.
  return (
    <Suspense fallback={null}>
      <ModalInside {...props}></ModalInside>
    </Suspense>
  );
}

function ModalInside({
  isOpen,
  onClose,
  className,
  children,
  ...props
}: ModalProps): ReactNode {
  const dismiss = useModalDismissed({
    key: props.allowDismiss ? props.key : undefined,
  });

  return (
    <AnimatePresence>
      {isOpen && !dismiss.isDismissed ? (
        <>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={clsx(MODAL, "bg-black bg-opacity-50 backdrop-blur")}
          />
          <motion.div
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 200 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={clsx(MODAL, "flex justify-center items-center")}
            aria-hidden
            onClick={onClose}
          >
            <div
              // Stop propagation of the click event to prevent the modal from closing
              onClick={stopPropagation}
              className={clsx("bg-background p-4 rounded", className)}
            >
              {children}
              {dismiss.dismissable ? (
                <Button variant="link" onClick={dismiss.dismiss}>
                  Never show this again
                </Button>
              ) : null}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export { Modal };
