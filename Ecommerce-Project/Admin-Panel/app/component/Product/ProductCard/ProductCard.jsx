import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // ✅ Font Awesome Icons

export default function ProductCard({ productdata, onDelete, onEdit }) {
  const router = useRouter();

  const truncateDescription = (text, maxLength = 20) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const handleView = () => {
    router.push(`/admin/product/productdetails/${productdata._id}`);
  };

  return (
    <tr>
      <td>
        <Image
          src={productdata.image}
          alt="product"
          width={50}
          height={50}
        />
      </td>

      <td>{productdata.name}</td>

      <td>{productdata.category_id?.name || "No Category"}</td>

      <td>{truncateDescription(productdata.description)}</td>

      <td>${productdata.price}</td>

      <td>{productdata.quantity}</td>

      <td>
        <div className="d-flex justify-content-center gap-1">
          <button
            className="btn btn-info btn-sm"
            onClick={handleView}
            title="View"
          >
            <FaEye />
          </button>

          <button
            className="btn btn-warning btn-sm"
            onClick={() => onEdit(productdata._id)}
            title="Edit"
          >
            <FaEdit />
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={onDelete}
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
}