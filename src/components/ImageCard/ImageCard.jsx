import css from "./ImageCard.module.css";

export default function ImageCard({ image, onClick }) {
  return (
    <div className={css.card} onClick={() => onClick(image)} role="button" tabIndex={0}>
      <img
        className={css.img}
        src={image.urls.small}
        alt={image.alt_description || image.description || "Image"}
        loading="lazy"
      />
    </div>
  );
}