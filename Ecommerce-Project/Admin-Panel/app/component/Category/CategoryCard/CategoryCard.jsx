import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // ✅ Font Awesome icons

export default function CategoryCard({ categorydata, onEdit, onDelete }) {
  const router = useRouter();

  const truncateDescription = (text, maxLength = 20) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const handleView = () => {
    router.push(`/admin/category/categorydetails/${categorydata._id}`);
  };

  return (
    <tr>
      <td>
        <Image src={categorydata.image} alt="category" width={50} height={50} />
      </td>

      <td>{categorydata.name}</td>

      <td>{truncateDescription(categorydata.description)}</td>

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
            onClick={onEdit}
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
