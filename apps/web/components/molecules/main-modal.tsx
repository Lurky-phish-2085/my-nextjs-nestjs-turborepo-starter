'use client';

import { useModal } from '@/providers/modal.provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../atoms/dialog';

export default function MainModal() {
  const {
    title,
    description,
    isModal,
    isOpen: isModalOpen,
    setIsModalOpen,
  } = useModal();

  const onInteractOutside = (e: Event) => {
    if (isModal) e.preventDefault();
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => setIsModalOpen(open)}
      modal={isModal}
    >
      <DialogContent onInteractOutside={onInteractOutside}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
