import { Button } from "@components";

export const PaginationControls = ({ page, totalPages, totalCount, onPrev, onNext }) => (
  <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-300">
    <Button
      onClick={onPrev}
      disabled={page <= 1}
      className="bg-white border border-slate-400 text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-400 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Prev
    </Button>
    <span className="text-sm font-medium text-slate-500">
      <span className="hidden sm:inline">
        Page {page} of {totalPages} (Total: {totalCount})
      </span>
      <span className="sm:hidden">
        {page} / {totalPages}
      </span>
    </span>
    <Button
      onClick={onNext}
      disabled={page >= totalPages}
      className="bg-white border border-slate-400 text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-400 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </Button>
  </div>
);