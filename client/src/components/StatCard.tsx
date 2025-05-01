interface StatCardProps {
  title: string;
  value: number;
  color: string;
  borderColor: string;
}

const StatCard = ({ title, value, color, borderColor }: StatCardProps) => {
  return (
    <div className={`${color} p-4 rounded-md border ${borderColor}`}>
      <p className={`text-${borderColor.replace('border-', '')} text-sm`}>{title}</p>
      <p className="text-2xl font-medium">{value}</p>
    </div>
  );
};

export default StatCard;
