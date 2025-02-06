import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, Folder } from 'lucide-react';
import Image from 'next/image';

export default function FileExplorer() {
  return (
    <div className="relative flex min-h-max flex-col gap-1 rounded-b-lg border border-t-0 border-border bg-background p-1">
      {/* Parent - Level 0 */}
      <div className="flex h-9 cursor-pointer items-center gap-0.5 rounded-md pl-2.5 text-sm transition-colors hover:bg-gray-100">
        <div className="flex w-full items-center gap-2">
          <span className="nodrag group/checkbox -m-2 flex items-center justify-center rounded-lg p-2 transition hover:bg-gray-50 active:opacity-50">
            <Checkbox className="group-hover/checkbox:opacity-100 group-active/checkbox:scale-90" />
          </span>
          <div style={{ marginLeft: '0rem' }}>
            <div className="h-5.5 min-h-5.5 w-5.5 min-w-5.5 -m-0.5 flex items-center justify-center p-0">
              <ChevronRight
                width={18}
                height={18}
                className="rotate-0 opacity-100 transition-transform"
              />
            </div>
          </div>
          <Folder
            width={18}
            height={18}
            className="lh-[18px] min-h-[18px] w-[18px] min-w-[18px]"
          />

          <p className="flex flex-shrink flex-grow items-center gap-2">
            <span className="line-clamp-1 min-w-0 flex-shrink break-all">
              acme
            </span>
          </p>
          <div
            className="flex items-center"
            style={{ width: '5rem', minWidth: '5rem' }}
          ></div>
        </div>
      </div>
      {/* Folder - Level 1 */}
      <div className="flex h-9 cursor-pointer items-center gap-0.5 rounded-md pl-2.5 text-sm transition-colors hover:bg-gray-100">
        <div className="flex w-full items-center gap-2">
          <span className="nodrag group/checkbox -m-2 flex items-center justify-center rounded-lg p-2 transition hover:bg-gray-50 active:opacity-50">
            <Checkbox className="group-hover/checkbox:opacity-100 group-active/checkbox:scale-90" />
          </span>
          <div style={{ marginLeft: '1.625rem' }}>
            <div className="h-5.5 min-h-5.5 w-5.5 min-w-5.5 -m-0.5 flex items-center justify-center p-0">
              <ChevronRight
                width={18}
                height={18}
                className="rotate-0 opacity-100 transition-transform"
              />
            </div>
          </div>
          <Folder
            width={18}
            height={18}
            className="lh-[18px] min-h-[18px] w-[18px] min-w-[18px]"
          />
          <p className="flex flex-shrink flex-grow items-center gap-2">
            <span className="line-clamp-1 min-w-0 flex-shrink break-all">
              chapters
            </span>
          </p>
          <div
            className="flex items-center"
            style={{ width: '5rem', minWidth: '5rem' }}
          />
        </div>
      </div>
      {/* Folder - Level 2 */}
      <div className="flex h-9 cursor-pointer items-center gap-0.5 rounded-md pl-2.5 text-sm transition-colors hover:bg-gray-100">
        <div className="flex w-full items-center gap-2">
          <span className="nodrag group/checkbox -m-2 flex items-center justify-center rounded-lg p-2 transition hover:bg-gray-50 active:opacity-50">
            <Checkbox className="group-hover/checkbox:opacity-100 group-active/checkbox:scale-90" />
          </span>
          <div style={{ marginLeft: '3.25rem' }}>
            <div className="h-5.5 min-h-5.5 w-5.5 min-w-5.5 -m-0.5 flex items-center justify-center p-0">
              <ChevronRight
                width={18}
                height={18}
                className="rotate-0 opacity-100 transition-transform"
              />
            </div>
          </div>
          <Folder
            width={18}
            height={18}
            className="lh-[18px] min-h-[18px] w-[18px] min-w-[18px]"
          />
          <p className="flex flex-shrink flex-grow items-center gap-2">
            <span className="line-clamp-1 min-w-0 flex-shrink break-all">
              chapters
            </span>
          </p>
          <div
            className="flex items-center"
            style={{ width: '5rem', minWidth: '5rem' }}
          />
        </div>
      </div>
      {/* Child - Level 3 */}
      <div className="flex h-9 items-center gap-0.5 rounded-md pl-2.5 text-sm transition-colors">
        <div className="flex w-full items-center gap-2">
          <button className="nodrag group/checkbox -m-2 flex items-center justify-center rounded-lg p-2 transition hover:bg-gray-50 active:opacity-50">
            <button
              type="button"
              role="none"
              aria-checked="false"
              data-state="unchecked"
              value="on"
              className="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow transition-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 group-hover/checkbox:opacity-100 group-active/checkbox:scale-90 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              tabIndex={-1}
            />
          </button>
          <div
            className="h-[18px] min-h-[18px] w-[18px] min-w-[18px]"
            style={{ marginLeft: '4.875rem' }}
          />
          <Image
            alt="pdf"
            width="18"
            height="18"
            className="h-[18px] min-h-[18px] w-[18px] min-w-[18px]"
            src="/file-types/pdf.svg"
          />
          <p className="flex flex-shrink flex-grow items-center gap-2">
            <span className="line-clamp-1 min-w-0 flex-shrink break-all">
              Copy of ACME_Earnings_Report_Q2_2024.pdf
            </span>
          </p>
          <div
            className="flex items-center"
            style={{ width: '5rem', minWidth: '5rem' }}
          >
            <div
              className="relative line-clamp-1 text-sm text-gray-600"
              data-state="closed"
            >
              4.7 KB
            </div>
          </div>
        </div>
      </div>
      {/* Child - Level 0 */}
      <div className="flex h-9 items-center gap-0.5 rounded-md pl-2.5 text-sm transition-colors">
        <div className="flex w-full items-center gap-2">
          <button className="nodrag group/checkbox -m-2 flex items-center justify-center rounded-lg p-2 transition hover:bg-gray-50 active:opacity-50">
            <button
              type="button"
              role="none"
              aria-checked="false"
              data-state="unchecked"
              value="on"
              className="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow transition-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 group-hover/checkbox:opacity-100 group-active/checkbox:scale-90 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              tabIndex={-1}
            />
          </button>
          <div
            className="h-[18px] min-h-[18px] w-[18px] min-w-[18px]"
            style={{ marginLeft: '0rem' }}
          />
          <Image
            alt="pdf"
            width="18"
            height="18"
            className="h-[18px] min-h-[18px] w-[18px] min-w-[18px]"
            src="/file-types/pdf.svg"
          />
          <p className="flex flex-shrink flex-grow items-center gap-2">
            <span className="line-clamp-1 min-w-0 flex-shrink break-all">
              Copy of ACME_Earnings_Report_Q2_2024.pdf
            </span>
          </p>
          <div
            className="flex items-center"
            style={{ width: '5rem', minWidth: '5rem' }}
          >
            <div
              className="relative line-clamp-1 text-sm text-gray-600"
              data-state="closed"
            >
              4.7 KB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
