import { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

function App() {
  const [inputValue, setInputValue] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const intervalRef = useRef(null);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [gaugeData, setGaugeData] = useState({});
  const [topToxicUsers, setTopToxicUsers] = useState([]);
  const [toxicityScore, setToxicityScore] = useState(0);

  const processData = (comments) => {
    const superToxicCount = comments.filter((c) => c.label === 2).length;
    const toxicCount = comments.filter((c) => c.label === 1).length;
    const nonToxicCount = comments.filter((c) => c.label === 0).length;

    setChartData({
      labels: ["Non-Toxic", "Toxic", "Super Toxic"],
      datasets: [
        {
          label: "Toxicity Percentage",
          data: [nonToxicCount, toxicCount, superToxicCount],
          backgroundColor: ["#4CAF50", "#F44336", "#FF9800"],
        },
      ],
    });

    setGaugeData({
      labels: ["Toxicity Score"],
      datasets: [
        {
          data: [
            ((toxicCount + 2 * superToxicCount) / comments.length) * 100,
            100 - ((toxicCount + 2 * superToxicCount) / comments.length) * 100,
          ],
          backgroundColor: [
            (toxicCount + 2 * superToxicCount) / comments.length > 0.5
              ? "#F44336"
              : "#4CAF50",
            "#ccc",
          ],
          borderWidth: 1,
        },
      ],
    });

    const toxicUsers = comments
      .filter((c) => c.label === 2 || c.label === 1)
      .reduce((acc, curr) => {
        acc[curr.author] = (acc[curr.author] || 0) + 1;
        return acc;
      }, {});

    const sortedToxicUsers = Object.entries(toxicUsers)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    setTopToxicUsers(sortedToxicUsers);
  };

  const extractVideoId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/);
    return match ? match[1] : null;
  };

  const startDetection = async () => {
    const id = extractVideoId(inputValue);
    if (!id) {
      toast.error("Invalid YouTube URL");
      return;
    }
    setVideoId(id);
    setIsDetecting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/start-collecting",
        { videoId: id }
      );
      if (response.status === 200) {
        toast.success("Detection started successfully!");

        intervalRef.current = setInterval(async () => {
          try {
            const response = await axios.get(
              `http://localhost:3000/api/rcvdata`
            );
            console.log("Detection result:", response.data);

            setData(response.data);
            processData(response.data);
          } catch (error) {
            console.error("Error fetching detection result:", error);
            toast.error("Error fetching detection result");
          }
        }, 5000);
      } else {
        toast.error("Failed to start detection");
        setIsDetecting(false);
      }
    } catch (error) {
      toast.error("Error starting detection");
      console.error("Error:", error);
      setIsDetecting(false);
    }
  };

  const stopDetection = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDetecting(false);

    try {
      const response = await axios.delete(
        "http://localhost:3000/api/stop-collecting"
      );
      if (response.status === 200) {
        toast.success("Detection stopped successfully!");
      } else {
        toast.error("Failed to stop detection");
      }
    } catch (error) {
      console.error("Error stopping detection:", error);
      toast.error("Error stopping detection");
    }
  };

  return (
    <>
      <div className="min-h-screen w-full flex flex-col py-10 items-center gap-10">
        <img src="./Logo_UIT_Web.png" alt="" className="w-[5%] h-auto" />
        <div className="flex flex-col justify-center items-center gap-3">
          <h1>IE212 (BigData) Final Project</h1>
          <h1 className="font-bold text-2xl">
            Toxic Comment Detection on YouTube Livestreams: Leveraging Kafka,
            Spark Streaming, and Deep Learning
          </h1>
          <div className="flex italic gap-8">
            <p>Nguyễn Quang Đăng</p>
            <p>Phạm Đăng An</p>
            <p>Đỗ Trọng Hợp</p>
          </div>
        </div>
        <div className="flex gap-5 justify-center items-center">
          <input
            type="text"
            className="min-w-[1000px] py-2 px-4 rounded bg-slate-200 focus:outline-none"
            placeholder="Enter YouTube livestream link ..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {!isDetecting ? (
            <button
              className="bg-blue-500 text-white px-3 py-2 rounded"
              onClick={startDetection}
            >
              Detect
            </button>
          ) : (
            <button
              className="bg-red-500 text-white px-3 py-2 rounded"
              onClick={stopDetection}
            >
              Stop
            </button>
          )}
        </div>

        {chartData && topToxicUsers.length !== 0 && (
          <>
            <div className="flex gap-20">
              <div className="w-96 mx-auto mb-12">
                <Pie data={chartData} />
              </div>

              <div className="w-96 mx-auto mb-12">
                <Pie data={gaugeData} />
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Top 10 Toxic Users</h2>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">User</th>
                    <th className="px-4 py-2 border text-right">
                      Toxic Comments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topToxicUsers.map(([user, count], index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 border">{user}</td>
                      <td className="px-4 py-2 border text-right">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
