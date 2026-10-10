export default function PageHeader({
  title,
  description,
  right,
}: {
  title: string;
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-dm text-gray-900">
          {title}
        </h1>
        {description && (
          <p className="text-sm font-dm text-gray-500">{description}</p>
        )}
      </div>
      {right}
    </div>
  );
}
