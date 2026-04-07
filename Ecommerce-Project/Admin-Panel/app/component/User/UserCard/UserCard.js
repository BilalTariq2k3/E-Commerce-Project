import { FaTrash } from "react-icons/fa";
import Image from "next/image";




export default function UserCard({ user,onDelete }) {


  // function to truncate long text
  const truncate = (text, maxLength = 20) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
  <>
   <tr>
      <td>
        <Image
          src={user.profileImage || "/default-avatar.png"}
          alt={user.fname + " " + user.lname}
          width={50}
          height={50}
        />
      </td>
      <td style={{ maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {truncate(user.fname + " " + user.lname, 20)}
      </td>
      <td style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {truncate(user.email, 25)}
      </td>
      <td>{user.phone}</td>
      <td style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {truncate(user.address, 25)}
      </td>
      <td>{user.dob?.slice(0, 10)}</td>
      <td>
        <div className="d-flex justify-content-center gap-1">
          <button className="btn btn-danger btn-sm" onClick={onDelete}>
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>


</>
 
  );
}