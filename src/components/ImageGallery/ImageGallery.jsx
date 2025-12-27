import ImageCard from "../ImageCard/ImageCard";
import css from "./ImageGallery.module.css";

export default function ImageGallery({ images, onImageClick }) {
  return (
    <ul className={css.list}>
      {images.map((img) => (
        <li key={img.id} className={css.item}>
          <ImageCard image={img} onClick={onImageClick} />
        </li>
      ))}
    </ul>
  );
}