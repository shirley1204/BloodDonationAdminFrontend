import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import {styles} from "./DashboardStyles"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#90191F",
  "#2563eb",
  "#db2777",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
];

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = async () => {
  try {
    setLoading(true);

    const res = await axios.get(`${BASE_URL}getList`, {
      params: { page: 1, limit: 100000, search: "" },
      withCredentials: true,
    });

    setData(res.data.data || []);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, [refreshKey]);

const handleRefresh = () => {
  setRefreshKey((prev) => prev + 1);
};

  const totalDonors = data.length;

  const bloodStats = useMemo(() => {
    const map = {};
    data.forEach((d) => {
      const bg = (d.bloodGrp || "Unknown").toUpperCase();
      map[bg] = (map[bg] || 0) + 1;
    });
    return map;
  }, [data]);

  const bloodChart = Object.entries(bloodStats).map(([name, value]) => ({
    name,
    value,
  }));

  const genderStats = useMemo(() => {
    const g = { Male: 0, Female: 0, Other: 0 };
    data.forEach((d) => {
      if (d.gender === "Male") g.Male++;
      else if (d.gender === "Female") g.Female++;
      else g.Other++;
    });
    return g;
  }, [data]);

  const genderChart = [
    { name: "Male", value: genderStats.Male },
    { name: "Female", value: genderStats.Female },
    { name: "Other", value: genderStats.Other },
  ];

  const userStats = useMemo(() => {
    const map = {};
    data.forEach((d) => {
      const user = d.created_by || "Unknown";
      map[user] = (map[user] || 0) + 1;
    });

    return Object.entries(map).map(([user, count]) => ({
      user,
      count,
    }));
  }, [data]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.title}>Admin Dashboard</div>
        <div style={styles.subtitle}>Blood Donation Analytics Overview</div>
         <button
          onClick={handleRefresh}
          style={{
            background: "#90191F",
            color: "white",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "13px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      {loading && <div style={styles.loading}>Loading data...</div>}
       
      <div style={styles.grid4}>
        <Card title="Total Donors" value={totalDonors} />
        <Card title="Male" value={genderStats.Male} color="#2563eb" />
        <Card title="Female" value={genderStats.Female} color="#db2777" />
        <Card title="Others" value={genderStats.Other} color="#6b7280" />
      </div>

      <div style={styles.sectionTitle}>Blood Groups</div>
      <div style={styles.gridBlood}>
        {Object.entries(bloodStats).map(([bg, count]) => (
          <div key={bg} style={styles.bloodCard}>
            <div style={styles.bloodType}>{bg}</div>
            <div style={styles.bloodCount}>{count}</div>
          </div>
        ))}
      </div>

      <div style={styles.grid3}>
        {/* Blood Group Distribution */}
        <div style={styles.cardBox}>
          <div style={styles.sectionTitle}>Blood Group Distribution</div>
          <ResponsiveContainer width="100%" height={260} style={{fontSize :"13px"}}>
            <PieChart>
              <Pie
                data={bloodChart}
                dataKey="value"
                outerRadius={90}
                label={({ name, value }) => `${name} (${value})`}
              >
                {bloodChart.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Distribution */}
        <div style={styles.cardBox}>
          <div style={styles.sectionTitle}>User Distribution</div>
          <ResponsiveContainer width="100%" height={260} style={{fontSize :"13px"}}>
            <BarChart data={userStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="user"
                angle={-20}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#90191F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div style={styles.cardBox}>
          <div style={styles.sectionTitle}>Gender Distribution</div>
          <ResponsiveContainer width="100%" height={260} style={{fontSize :"13px"}}>
            <BarChart data={genderChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#90191F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.sectionTitle}>User Contributions</div>

      <div style={styles.userGrid}>
        {userStats.map((u, i) => (
          <div key={i} style={styles.userCard}>
            <div style={styles.avatar}>{u.user.slice(0, 1).toUpperCase()}</div>
            <div>
              <div style={styles.userName}>{u.user}</div>
              <div style={styles.userMeta}>{u.count} records</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

const Card = ({ title, value, color = "#90191F" }) => (
  <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
    <div style={styles.cardTitle}>{title}</div>
    <div style={{ ...styles.cardValue, color }}>{value}</div>
  </div>
);


