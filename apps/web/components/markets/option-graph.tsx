"use client";

import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { MarketOptionHistory } from "@dpm/database";
import dynamic from "next/dynamic";

const OptionGraph = ({
  marketId,
  optionId,
}: {
  marketId: string;
  optionId: string;
}) => {
  const [yesData, setYesData] = useState([]);
  const [noData, setNoData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

  useEffect(() => {
    async function getOptionGraph() {
      setIsLoading(true);
      const response = await fetch(
        `/api/markets/${marketId}/options?optionId=${optionId}`,
      );

      setIsLoading(false);
      if (!response.ok) {
        console.error(response);
        return toast({
          title: "Error",
          description: "Error getting data for graphs",
          variant: "destructive",
        });
      }

      const mohs = await response.json();
      const formattedYesData = mohs.map((moh: MarketOptionHistory) => {
        return [
          new Date(moh.createdAt).getTime(),
          +(moh.value * 100).toFixed(2),
        ];
      });
      setYesData(formattedYesData);
      const formattedNoData = formattedYesData.map((d) => {
        return [d[0], Math.abs(100 - d[1])];
      });
      setNoData(formattedNoData);
    }
    getOptionGraph();
  }, [marketId, optionId]);

  return (
    <>
      {!isLoading && typeof window !== "undefined" && (
        <Chart
          options={{
            yaxis: {
              labels: {
                formatter: (value) => {
                  return value.toFixed(0);
                },
              },
              max: 100,
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              width: 2,
              curve: "straight",
            },
            xaxis: {
              type: "datetime",
            },
            legend: {
              show: false,
            },
          }}
          series={[
            {
              name: "No",
              color: "#b91c1c",
              data: noData,
            },
            {
              name: "Yes",
              color: "#15803d",
              data: yesData,
            },
          ]}
          type="area"
          width="100%"
          height={192}
        />
      )}
    </>
  );
};

export { OptionGraph };
