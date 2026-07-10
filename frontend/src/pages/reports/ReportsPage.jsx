import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { downloadAssetsPdf, downloadAssetsCsv } from '../../api/endpoints/reports';

function ReportCard({ title, description, onDownloadPdf, onDownloadCsv }) {
  const [isDownloading, setIsDownloading] = useState(null); // 'pdf' | 'csv' | null
  const [error, setError] = useState('');

  async function handleDownload(type, action) {
    setIsDownloading(type);
    setError('');
    try {
      await action();
    } catch {
      setError('Could not generate this report. Please try again.');
    } finally {
      setIsDownloading(null);
    }
  }

  return (
    <div className="bg-white rounded-[10px] border border-[#E2E4E8] p-5">
      <h3 className="font-medium text-[#10182B]">{title}</h3>
      <p className="mt-1 text-sm text-[#5B6472]">{description}</p>

      {error && <p className="mt-2 text-sm text-[#B23B1E]">{error}</p>}

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => handleDownload('pdf', onDownloadPdf)}
          disabled={isDownloading !== null}
          className="px-3.5 py-2 rounded-[8px] text-sm font-medium bg-[#10182B] text-[#EDEEF0] hover:bg-[#1B2540] disabled:opacity-60 transition"
        >
          {isDownloading === 'pdf' ? 'Generating…' : 'Download PDF'}
        </button>
        <button
          onClick={() => handleDownload('csv', onDownloadCsv)}
          disabled={isDownloading !== null}
          className="px-3.5 py-2 rounded-[8px] text-sm font-medium border border-[#D5D8DD] text-[#10182B] hover:bg-[#EDEEF0] disabled:opacity-60 transition"
        >
          {isDownloading === 'csv' ? 'Generating…' : 'Download CSV'}
        </button>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen bg-[#EDEEF0]">
      <Sidebar />

      <main className="flex-1 px-8 py-8 md:px-12">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.1em] text-[#8891A3] uppercase">Reports</p>
          <h1 className="mt-1 font-[Space_Grotesk] text-2xl font-medium text-[#10182B]">
            Export Reports
          </h1>
          <p className="mt-2 text-sm text-[#5B6472]">
            Generate downloadable reports for record-keeping and audits.
          </p>

          <div className="mt-6 grid gap-4">
            <ReportCard
              title="Asset Inventory"
              description="Full list of all registered assets, their category, status, and purchase details."
              onDownloadPdf={downloadAssetsPdf}
              onDownloadCsv={downloadAssetsCsv}
            />
            {/* More report cards (Assignments, Damage Reports, Financial) can be
                added here once their backend export endpoints exist. */}
          </div>
        </div>
      </main>
    </div>
  );
}