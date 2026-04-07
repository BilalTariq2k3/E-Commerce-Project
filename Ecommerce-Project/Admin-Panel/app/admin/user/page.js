"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "../../component/DashboardLayout/DashboardLayout";
import { useGetUsersQuery } from "../../features/UserApi";
import UserCard from "../../component/User/UserCard/UserCard";
import UserDeleteModal from "../../component/User/DeleteUserModal/DeleteUserModal";
import Loading from "../../component/Loader/Loader";

export default function User() {
  const { data, isLoading, error, refetch } = useGetUsersQuery();
  const users = data || [];
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // console.log("usssers", users);

  useEffect(() => {
    refetch();
  }, []);

  console.log("data product", users);

  if (isLoading) return <Loading />;
  if (error) return <p>Error...</p>;

  return (
    <DashboardLayout>
      <div
        className="container-fluid px-0 vh-100"
        style={{ backgroundColor: "whitesmoke" }}
      >
        <h1 className="d-flex justify-content-center  py-3">Users</h1>

        <div
          className="table-responsive mx-auto my-4"
          style={{ maxWidth: "90%" }}
        >
          <table className="table table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Dob</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onDelete={() => {
                    setSelectedUser(user);
                    setDeleteModal(true);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
        <UserDeleteModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          User={selectedUser}
        />
      </div>
    </DashboardLayout>
  );
}
