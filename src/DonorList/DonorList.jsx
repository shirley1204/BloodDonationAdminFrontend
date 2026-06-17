import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { MaterialReactTable } from "material-react-table";
import BloodDropLoader from "../Utils/BloodDropLoader";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const DonorList = () => {
  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const isFetchingRef = React.useRef(false);

  const fetchData = async () => {
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setIsFetching(true);

      const res = await axios.get(`${BASE_URL}getList`, {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: debouncedSearch,
        },
        withCredentials: true,
      });

      setData(res.data.data);
      setRowCount(res.data.totalRecords || 0);
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetching(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(globalFilter);
    }, 400);

    return () => clearTimeout(timer);
  }, [globalFilter]);

  const handleRefresh = () => {
    fetchData();
  };

  const formatDOB = (dob) => {
    if (!dob) return "";

    const date = new Date(dob);

    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const downloadXLSX = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}getList`, {
        params: {
          page: 1,
          limit: 1000000,
          search: globalFilter,
        },
        withCredentials: true,
      });

      const allData = res.data.data || [];
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Donor List");

      worksheet.columns = [
        { header: "Name", key: "name", width: 20 },
        { header: "Gender", key: "gender", width: 15 },
        { header: "Mobile", key: "mobile", width: 20 },
        { header: "DOB", key: "dob", width: 20 },
        { header: "Address", key: "address", width: 25 },
        { header: "Blood Group", key: "bloodGrp", width: 15 },
        { header: "Age", key: "age", width: 10 },
        { header: "No. of times Donated", key: "count", width: 20 },
        { header: "Created By", key: "created_by", width: 20 },
      ];

      allData.forEach((item) => {
        worksheet.addRow({
          name: item.name || "",
          gender: item.gender || "",
          mobile: item.mobile || "",
          dob: formatDOB(item.dob),
          address: item.address || "",
          bloodGrp: item.bloodGrp || "",
          age: item.age || "",
          count: item.count || "",
          created_by: item.created_by || "",
        });
      });

      worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFF00" },
        };

        cell.font = {
          bold: true,
          color: { argb: "FF000000" },
        };

        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      });

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "donor_list.xlsx");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "gender", header: "Gender" },
      { accessorKey: "mobile", header: "Mobile" },

      {
        accessorKey: "dob",
        header: "DOB",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          if (!value) return "-";

          return new Date(value).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });
        },
      },

      { accessorKey: "address", header: "Address" },
      { accessorKey: "bloodGrp", header: "Blood Group" },
      { accessorKey: "age", header: "Age" },
      { accessorKey: "count", header: "No.of times Donated" },
      { accessorKey: "created_by", header: "Created_By" },
    ],
    [],
  );

    return (
    <div style={{ width: "100%" }}>
       {isLoading && <BloodDropLoader />}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          padding: "8px 4px",
        }}
      >
        <div style={{ fontSize: "16px", fontWeight: 700, color: "black" }}>
          Total Registrations: {rowCount}
        </div>
        <div>
          <button
            onClick={downloadXLSX}
            className="bg-[#90191F] text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-60 cursor-pointer"
          >
            Download Excel
          </button>
          <button
            className="bg-[#90191F] text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-60 cursor-pointer ml-1"
            onClick={handleRefresh}
          >
            Refresh
          </button>
        </div>
      </div>
      {isFetching && (
        <div
          style={{ fontSize: "12px", color: "#90191F", marginBottom: "5px" }}
        >
          Loading...
        </div>
      )}
      <MaterialReactTable
        columns={columns}
        data={data}
        manualPagination
        rowCount={rowCount}
        state={{
          pagination,
          globalFilter,
        }}
        onPaginationChange={setPagination}
        onGlobalFilterChange={(val) => {
          setGlobalFilter(val);
        }}
        enableGlobalFilter
        enableColumnActions={false}
        enableColumnFilters={false}
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        enableHiding={false}
        enableSorting={false}
        muiTopToolbarProps={{
          sx: {
            backgroundColor: "white",
            padding: "12px 16px",
            minHeight: "64px",
          },
        }}
        muiSearchTextFieldProps={{
          placeholder: "Search donors...",
          variant: "outlined",
          size: "small",
          sx: {
            minWidth: "320px",
          },
        }}
        muiTableBodyRowProps={{
          sx: {
            height: "40px",
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            padding: "6px 10px",
            fontSize: "13px",
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: "#ffffff",
            fontWeight: 600,
            fontSize: "15px",
            padding: "12px 10px",
            color: "#90191F",
          },
        }}
        muiTableContainerProps={{
          sx: {
            maxHeight: "70vh",
          },
        }}
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "none",
          },
        }}
      />
    </div>
  );
};

export default DonorList;
