import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { MaterialReactTable } from "material-react-table";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import BloodDropLoader from "../Utils/BloodDropLoader";

const Users = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get(`${BASE_URL}users`, {
        withCredentials: true,
      });

      setData(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "firstName",
        header: "First Name",
        size: 100,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        size: 100,
      },
      {
        accessorKey: "emailId",
        header: "Email",
        size: 150,
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 100,
      },
    //   {
    //     header: "Action",
    //     size: 80,
    //     Cell: ({ row }) => (
    //       <button
    //         onClick={() => navigate(`/editUser/${row.original._id}`)}
    //         className="text-[#90191F] hover:text-[#6f1217]"
    //       >
    //         <FiEdit2 size={16} />
    //       </button>
    //     ),
    //   },
    ],
    [navigate],
  );

  if (isLoading) {
    return <BloodDropLoader />;
  }

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          padding: "8px 4px",
        }}
      >
        <button
          className="btn bg-[#90191F] text-white border-none hover:bg-[#6f1217]"
          onClick={() => navigate("/addUser")}
        >
          + Add User
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <MaterialReactTable
          columns={columns}
          data={data}
          enablePagination={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          enableGlobalFilter={false}
          enableColumnActions={false}
          enableColumnFilters={false}
          enableSorting={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableHiding={false}
          state={{ isLoading }}
          muiTableBodyRowProps={{
            sx: {
              height: "42px",
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              padding: "8px 10px",
              fontSize: "13px",
              whiteSpace: "nowrap",
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: "#fff",
              fontWeight: 600,
              fontSize: "13.5px",
              padding: "10px 10px",
              color: "#90191F",
              whiteSpace: "nowrap",
            },
          }}
          muiTableContainerProps={{
            sx: {
              maxHeight: "70vh",
              overflowX: "auto",
            },
          }}
          muiTablePaperProps={{
            elevation: 0,
            sx: {
              boxShadow: "none",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Users;
