"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const data = [
  { value: 10 },
  { value: 80 },
  { value: 30 },
  { value: 140 },
  { value: 130 },
  { value: 160 },
];

const StatsCard = ({ title, value, growth, borderColor, bgColor }:{ title:string; value:number; growth:number; borderColor: string; bgColor: string }) => {
  return (
    <Card className={`w-full h-[120px] border ${borderColor} ${bgColor} rounded-2xl`}>
      <CardContent className="p-5 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <h3 className=" text-secondary  md:text-[14px] lg:text-[14px]">{title}</h3>
          <div className="text-success bg-success-light text-sm px-2 py-1 rounded-sm">
            +{growth}%
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-3xl font-medium text-text">{value}</span>
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line type="monotone" dataKey="value" stroke="green"  dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function StatesCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-4 col-span-3">
      <StatsCard title="Active Collaborations" value={120} growth={5} bgColor="bg-white bg-[#f2f1fd]" borderColor={"border-[#7877EE]"} />
      <StatsCard title="Total Products" value={200} growth={5} borderColor="border-[#EB815B]" bgColor="bg-[#fdf2ef]" />
      <StatsCard title="Total Products" value={200} growth={5} borderColor="border-[#77EE8D]" bgColor="bg-[#f1fdf4]" />
      <StatsCard title="Total Products" value={200} growth={5} borderColor="border-[#9773C8]" bgColor="bg-[#f5f1fa]" />
      <StatsCard title="Total Products" value={200} growth={5} borderColor="border-[#C861A0]" bgColor="bg-[#faeff6]" />
    </div>
  );
}
