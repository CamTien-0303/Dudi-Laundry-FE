import { Search } from 'lucide-react';

interface NoSearchResultProps {
  query?: string;
  message?: string;
  className?: string;
}

export default function NoSearchResult({
  query,
  message = 'Không tìm thấy kết quả nào phù hợp.',
  className = '',
}: NoSearchResultProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      <span className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-4 text-muted/60">
        <Search size={22} />
      </span>
      <h3 className="text-sm font-semibold text-foreground">Không tìm thấy kết quả</h3>
      <p className="text-xs text-muted mt-1 max-w-[260px] leading-relaxed">
        {query ? (
          <>
            Không tìm thấy kết quả nào cho "<strong>{query}</strong>". Hãy thử từ khóa khác.
          </>
        ) : (
          message
        )}
      </p>
    </div>
  );
}
