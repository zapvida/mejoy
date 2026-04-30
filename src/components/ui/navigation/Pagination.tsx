type PaginationProps = {
  totalPages: number;
  currentPage: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (_page: number) => void;
};

export default function Pagination({ totalPages, currentPage, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex space-x-2 justify-center mt-4">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`px-4 py-2 rounded ${
            currentPage === i + 1
              ? 'bg-brand text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
