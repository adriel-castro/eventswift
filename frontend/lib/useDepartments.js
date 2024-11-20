import { useState, useEffect } from "react";
import { getDepartments } from "./db";

const useDepartments = (accessToken) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const getAllDepartment = async () => {
      try {
        const res = await getDepartments();
        const dept = res.data;

        let allDepartment = [];
        dept.forEach((item) => {
          allDepartment.push({
            value: item.name,
            label: item.name,
          });
        });

        setDepartments(allDepartment);
      } catch (error) {
        console.log("error on departments", error.message);
      }
    };

    getAllDepartment();
  }, [accessToken]);

  return { departments };
};

export default useDepartments;
