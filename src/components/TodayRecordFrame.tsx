interface TodayRecordFrameProps {
  value: number;
  unit: string;
}

export function TodayRecordFrame({ value, unit }: TodayRecordFrameProps) {
  return (
    <p className="min-w-38 rounded-xl bg-mist-300 px-5 py-3 text-center">
      <span className="text-5xl">{value}</span>
      <span className="text-lg">{unit}</span>
    </p>
  );
}
