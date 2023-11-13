import Cookies from "universal-cookie/es6/Cookies";
import axios from "axios";

const baseUrl = "http://localhost:3000";

export const getChartData = async (
  startDate?: string,
  endDate?: string,
  age?: string,
  gender?: string
) => {
  const queryParams = [];
  const cookies = new Cookies();
  const token = cookies.get("token");

  if (startDate && endDate) {
    queryParams.push(`startDate=${startDate}&endDate=${endDate}`);
  }
  if (age) {
    queryParams.push(`&age=${age}`);
  }
  if (gender) {
    queryParams.push(`&gender=${gender}`);
  }

  const response = await axios.get(
    `${baseUrl}/chart/data?${queryParams.join("&")}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (response.status === 200) {
    const data = response.data;
    return data;
  }
  return null;
};
