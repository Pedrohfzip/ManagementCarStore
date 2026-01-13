import Image from "next/image";
// import { Car } from "./cars";
import styles from "./CarCard.module.css";

export default function CarCard({ car }: { car: any }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {/* <Image
          // src={car.imagem}
          alt={car.name}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 640px) 100vw, 320px"
        /> */}
      </div>
      <h2 className={styles.title}>{car.name}</h2>
      <hr className={styles.divider} />
      {/* <div className={styles.priceRow}>
        <span className={styles.price}>R$ {car.preco.toLocaleString("pt-BR")}</span>
      </div> */}
      <hr className={styles.divider} />
      <p className={styles.description}>{car.brand}</p>
      <button className={styles.button}>Comprar</button>
    </div>
  );
}
