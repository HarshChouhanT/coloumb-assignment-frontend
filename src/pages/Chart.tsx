import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getChartData } from "../services/data.service";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import moment from "moment";
import Cookies from "universal-cookie";
import queryString from "query-string";

interface ChartInfo {
  date: Date;
  age?: string;
  gender?: string;
  a?: string;
  b?: string;
  c?: string;
  d?: string;
  e?: string;
  f?: string;
}

const Chart = () => {
  const navigate = useNavigate();

  const options: ApexOptions = {
    chart: {
      height: 350,
      width: 350,
      events: {
        click: (e, chartContext, config) => {
          setSelectedChartIndex(config.dataPointIndex);
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const [chartInfo, setChartInfo] = useState<ChartInfo[]>([]);
  const [barChartInfo, setBarChartInfo] = useState<any>([]);
  const [lineChartInfo, setLineChartInfo] = useState<any>([]);
  const [selectedChartIndex, setSelectedChartIndex] = useState<any>(undefined);
  const [featureArray, setFeatureArray] = useState<string[]>([]);

  const series = [
    {
      data: barChartInfo,
      xaxis: {
        type: "category",
      },
    },
  ];

  const lineSeries = [
    {
      data: lineChartInfo,
      xaxis: {
        type: "category",
      },
    },
  ];

  const lineOptions: ApexOptions = {
    chart: {
      height: 350,
      width: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  const loadData = async (
    startDate?: Date,
    endDate?: Date,
    age?: string,
    gender?: string
  ) => {
    const chartData = await getChartData(
      startDate ? moment(startDate).format("YYYY-MM-DD") : "",
      endDate ? moment(endDate).format("YYYY-MM-DD") : "",
      age,
      gender
    );
    setChartInfo(chartData);
    if (chartData && chartData.length > 0) {
      setFeatureArray(
        Object.keys(chartData[0])
          .filter((x) => x !== "date" && x !== "age" && x !== "gender")
          .map((key: string) => key)
      );
    }
    setSelectedChartIndex(undefined);
    setLineChartInfo([]);
  };

  // Get Cookies
  const cookies = new Cookies();

  const savedQueryParams = cookies.get("searchQuery");
  const params = queryString.parse(savedQueryParams);

  // Set filter values according to search params or cookie storage
  const startDate: any = searchParams.get("startDate")
    ? new Date(moment(searchParams.get("startDate")).format("YYYY-MM-DD"))
    : params.startDate
    ? params.startDate
    : undefined;
  const endDate: any = searchParams.get("endDate")
    ? new Date(moment(searchParams.get("endDate")).format("YYYY-MM-DD"))
    : params.endDate
    ? params.endDate
    : undefined;
  const age: any = searchParams.get("age")
    ? searchParams.get("age")
    : params.age
    ? params.age
    : undefined;
  const gender: any = searchParams.get("gender")
    ? searchParams.get("gender")
    : params.gender
    ? params.gender
    : undefined;

  useEffect(() => {
    loadData(startDate, endDate, age, gender);
    console.log(cookies);
  }, [searchParams]);

  // TODO: transform chartInfo into barChartInfo
  useEffect(() => {
    if (chartInfo) {
      const result = Object.entries(
        chartInfo.reduce((accumulator: any, currentValue: any) => {
          Object.entries(currentValue).forEach(([key, value]) => {
            if (key !== "date" && key !== "age" && key !== "gender") {
              accumulator[key] = (accumulator[key] || 0) + value;
            }
          });
          return accumulator;
        }, {})
      ).map(([key, value]) => ({ x: key?.toUpperCase(), y: value }));
      setBarChartInfo(result);
    }
  }, [chartInfo]);

  // TODO: transform chartInfo into lineChartInfo
  useEffect(() => {
    if (selectedChartIndex >= 0) {
      const result = chartInfo.reduce((accumulator: any, currentValue: any) => {
        const date = moment(new Date(currentValue.date)).format("YYYY-MM-DD");
        const feature = featureArray[selectedChartIndex];
        if (!accumulator[date]) {
          accumulator[date] = currentValue[feature];
        }
        return accumulator;
      }, {});
      let lineInfo = Object.entries(result).map(([key, value]) => ({
        x: moment(key).format("DD-MMM"),
        y: value,
      }));
      setLineChartInfo(lineInfo);
    }
  }, [selectedChartIndex, barChartInfo]);

  // Handle Filter Input Change
  const handleChange = (e: any) => {
    e.preventDefault();

    const key = e.target.id;
    const value = e.target.value;

    const params = [];
    if (startDate && key !== "startDate") {
      params.push("startDate=" + moment(startDate).format("YYYY-MM-DD"));
    }
    if (endDate && key !== "endDate") {
      params.push("endDate=" + moment(endDate).format("YYYY-MM-DD"));
    }
    if (age && key !== "age") {
      params.push("age=", age);
    }
    if (gender && key !== "gender") {
      params.push("gender=" + gender);
    }
    if (key === "startDate" || (key === "endDate" && value instanceof Date)) {
      params.push(key + "=" + value);
    } else {
      // check if value is empty / can be the case for select dropdowns
      if (value && value !== "") {
        params.push(key + "=" + value);
      }
    }

    const searchQuery = params.join("&");

    // Set search params for Cookies
    cookies.set("searchQuery", searchQuery);

    navigate("/chart?" + searchQuery);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    cookies.remove("token");
    navigate("/");
  };

  return (
    <>
      <div className="d-flex flex-row justify-content-between">
        <h1>Chart Data</h1>
        <button className="m-2 btn btn-dark" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
      <hr />
      <h2>Filters</h2>
      <div className="d-flex flex-row flex-wrap justify-content-between">
        <div className="flex-grow-1 d-flex flex-wrap justify-content-center m-3">
          <div className="mx-2">
            <label htmlFor="startDate" className="form-label">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              className="form-control"
              pattern="\d{4}-\d{2}-\d{2}"
              value={new Date(startDate)?.toISOString()?.split("T")[0]}
              onChange={handleChange}
            />
          </div>
          <div className="mx-2">
            <label htmlFor="endDate" className="form-label">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              className="form-control"
              value={new Date(endDate)?.toISOString()?.split("T")[0]}
              onChange={handleChange}
            />
          </div>
          <div className="mx-2">
            <label htmlFor="age" className="form-label">
              Age
            </label>
            <select
              id="age"
              className="form-select"
              value={age}
              onChange={handleChange}
            >
              <option value="">---Select---</option>
              <option value="15-25">15-25</option>
              <option value=">25">&gt;25</option>
            </select>
          </div>
          <div className="mx-2">
            <label htmlFor="gender" className="form-label">
              Gender
            </label>
            <select
              id="gender"
              className="form-select"
              value={gender}
              onChange={handleChange}
            >
              <option value="">---Select---</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>
      <hr />
      <div className="d-flex flex-row flex-wrap justify-content-between">
        <div id="barChart" className="flex-grow-1">
          Bar Chart
          <ReactApexChart options={options} type="bar" series={series} />
        </div>
        <div id="lineChart" className="flex-grow-1">
          Line Chart for {featureArray[selectedChartIndex]?.toUpperCase()}
          <ReactApexChart
            options={lineOptions}
            series={lineSeries}
            type="line"
          />
        </div>
      </div>
    </>
  );
};

export default Chart;
