import "./ProductCard.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CategoryCard({ productdata }) {
  const router = useRouter();

  return (
    <div className="Card-items ">
      <div className="image ">
        <Image
          className="img"
          src={productdata.image}
          alt="product image"
          width={400}
          height={300}
        />
      </div>
      <h1 className="name">
        {productdata.name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </h1>
      <p className="Description  ">{productdata.description}</p>
      <p className="Description  ">{productdata.price}$</p>

      <button
        className="card-button py-1 px-2"
        onClick={() => router.push(`/ProductDetails/${productdata._id}`)}
      >
        View Product
      </button>
    </div>
  );
}
