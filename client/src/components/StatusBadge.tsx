interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let color = '';
  let text = '';
  
  switch (status) {
    case 'pending':
      color = 'bg-pending bg-opacity-10 text-pending';
      text = 'Pending';
      break;
    case 'under-review':
      color = 'bg-under-review bg-opacity-10 text-under-review';
      text = 'Under Review';
      break;
    case 'resolved':
      color = 'bg-resolved bg-opacity-10 text-resolved';
      text = 'Resolved';
      break;
    default:
      color = 'bg-neutral-200 text-neutral-500';
      text = status || 'Unknown';
  }
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
      {text}
    </span>
  );
};

export default StatusBadge;
