import { AnimatePresence, motion } from "framer-motion";
import { stopPropagation } from "@lib/utils/dom/stopPropagation";
import { clsx } from "@lib/utils/dom/clsx";
import { ReactNode, Suspense } from "react";

const MODAL = "fixed left-0 top-0 bottom-0 right-0 z-20";

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
};

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
}: ModalProps): ReactNode {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={clsx(
              MODAL,
              "bg-black bg-opacity-50 backdrop-blur pointer-cursor",
            )}
          />
          <motion.div
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 200 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={clsx(
              MODAL,
              "flex justify-center items-center pointer-events-none",
            )}
            aria-hidden
            onClick={onClose}
          >
            <div
              // Stop propagation of the click event to prevent the modal from closing
              onClick={stopPropagation}
              className={clsx(
                "bg-background p-4 rounded pointer-events-auto",
                className,
              )}
            >
              {children}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export { Modal };
