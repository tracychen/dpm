"use client";

import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { MarketOptionHistory } from "@dpm/database";
import { Skeleton } from "../ui/skeleton";
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
  const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

  useEffect(() => {
    async function getOptionGraph() {
      const response = await fetch(
        `/api/markets/${marketId}/options?optionId=${optionId}`,
      );

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
        return [new Date(moh.createdAt).getTime(), +moh.value.toFixed(2)];
      });
      const formattedNoData = formattedYesData.map((d) => {
        return [d[0], 1 - d[1]];
      });
      console.log(formattedYesData, formattedNoData);
      setYesData(formattedYesData);
      setNoData(formattedNoData);
    }
    getOptionGraph();
  }, [marketId, optionId]);

  return (
    <>
      {typeof window !== "undefined" && (
        <Chart
          options={{
            yaxis: {
              labels: {
                formatter: (value) => {
                  return value.toFixed(2);
                },
              },
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
