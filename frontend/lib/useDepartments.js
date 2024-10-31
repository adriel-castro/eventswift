import { useState, useEffect } from "react";
import { getDepartments } from "./db";

const useDepartments = (networkStatus, accessToken) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const getAllDepartment = async () => {
      try {
        const dept = await getDepartments();
        let allDepartment = [];
        dept?.data.forEach((item) => {
          allDepartment.push({
            value: item.name,
            label: item.name,
          });
        });

        setDepartments(allDepartment);
      } catch (error) {
        console.log("error on departments");
        console.log("undef", error.message);
      }
    };

    getAllDepartment();
  }, [networkStatus, accessToken]);

  return { departments };
};

export default useDepartments;
