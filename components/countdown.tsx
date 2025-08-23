"use client";

import { useEffect, useState } from "react";
import { Card, Text, Progress, Badge } from "frosted-ui";

const getTimeLeftInMonth = () => {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  endOfMonth.setHours(0, 0, 0, 0);
  const diff = endOfMonth.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
};

const getMonthProgress = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const totalMonthTime = endOfMonth.getTime() - startOfMonth.getTime();
  const elapsedTime = now.getTime() - startOfMonth.getTime();

  const progress = (elapsedTime / totalMonthTime) * 100;
  return Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeftInMonth());
  const [progress, setProgress] = useState(getMonthProgress());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeftInMonth());
      setProgress(getMonthProgress());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full">
      <div className="flex flex-col items-center gap-4">
        <Badge size="2" className="uppercase">
          {new Date().toLocaleString("default", { month: "long" })}
        </Badge>
        <Card>
          <div className="flex flex-row items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Text size="9">{timeLeft.days}</Text>
              <Text size="5">Days</Text>
            </div>
            <Text size="5">:</Text>
            <div className="flex flex-col items-center gap-2">
              <Text size="9">{timeLeft.hours}</Text>
              <Text size="5">Hours</Text>
            </div>
            <Text size="5">:</Text>
            <div className="flex flex-col items-center gap-2">
              <Text size="9">{timeLeft.minutes}</Text>
              <Text size="5">Minutes</Text>
            </div>
            <Text size="5">:</Text>
            <div className="flex flex-col items-center gap-2">
              <Text size="9">{timeLeft.seconds}</Text>
              <Text size="5">Seconds</Text>
            </div>
          </div>
        </Card>
        <Progress max={100} size="3" value={progress} />
        <div className="flex items-center justify-between w-full">
          <Text size="3">SEASON START</Text>
          <Text size="3">TIME LEFT</Text>
          <Text size="3">SEASON END</Text>
        </div>
      </div>
    </Card>
  );
};

export default Countdown;
