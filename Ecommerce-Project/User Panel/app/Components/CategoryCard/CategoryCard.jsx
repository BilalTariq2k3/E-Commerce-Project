import "./CategoryCard.css";
import Image from "next/image";

export default function CategoryCard({ categorydata }) {
  return (
    <div className="Card-items ">
      <div className="image ">
        <Image
          className="img"
          src={categorydata.image}
          alt="category image"
          width={400}
          height={300}
        />
      </div>
      <h1 className="name my-4">{categorydata.name}</h1>
      <p className="Description  ">{categorydata.description}</p>

      <button className="card-button py-1 px-2">View Product</button>
    </div>
  );
}
