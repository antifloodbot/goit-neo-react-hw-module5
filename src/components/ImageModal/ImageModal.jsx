import Modal from "react-modal";
import css from "./ImageModal.module.css";

Modal.setAppElement("#root");

export default function ImageModal({ isOpen, onClose, image }) {
  if (!image) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      overlayClassName={css.overlay}
      className={css.content}
    >
      <div className={css.wrapper} onClick={onClose}>
        <img
          className={css.img}
          src={image.urls.regular}
          alt={image.alt_description || "Image"}
        />
      </div>
    </Modal>
  );
}