"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, 
  MapPin, 
  Download, 
  Link as LinkIcon, 
  Check, 
  Copy, 
  Globe
} from "lucide-react";
import { useGetCollection, useShareCollection } from "@/collections/collections.hooks";

export default function CollectionViewPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = params.id as string;

  const { data: collection, isLoading } = useGetCollection(collectionId);
  const shareMutation = useShareCollection();

  const [showLabels, setShowLabels] = useState(true);
  const [showAgentProfile, setShowAgentProfile] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async (shareId: string) => {
    const url = `${window.location.origin}/collections/public/${shareId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleGenerateLink = async () => {
    if (collection?.shareId) {
      handleCopyLink(collection.shareId);
      return;
    }

    try {
      const result = await shareMutation.mutateAsync(collectionId);
      if (result?.shareId) {
        handleCopyLink(result.shareId);
      }
    } catch (error) {
      console.error("Failed to generate share link:", error);
    }
  };

  const handleExportPDF = () => {
    console.log("Exporting PDF with settings:", { showLabels, showAgentProfile });
  };

  if (isLoading) {
    return (
      <div className="bg-[#f8f8f7] h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-[#2d2d2d] animate-spin mb-4" />
        <p className="text-[10px] font-black text-[#8e94a0] uppercase tracking-[0.15em]">
          Loading collection...
        </p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="bg-[#f8f8f7] h-[calc(100vh-80px)] flex items-center justify-center font-luxury-serif text-2xl">
        Collection not found
      </div>
    );
  }

  return (
    <div className="bg-[#f8f8f7] min-h-[calc(100vh-80px)] text-[#1a1a1a]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />

      <main className="max-w-400 mx-auto px-6 py-8 flex items-start gap-10">
        
        <div className="flex-1 w-full min-w-0">
          <div className="flex items-center gap-6 mb-8 pl-2">
            <button
              onClick={() => router.push(`/projects/${collection.project?.id}`)}
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm shrink-0"
            >
              <ArrowLeft size={20} strokeWidth={1.5} className="text-[#1a1a1a]" />
            </button>
            <div className="min-w-0">
              <h1 className="text-[32px] font-luxury-serif leading-none tracking-tight text-[#1a1a1a] mb-1.5 truncate">
                {collection.name}
              </h1>
              {collection.project && (
                <div className="flex items-center gap-1.5 text-[#8e94a0] font-medium text-[13px] truncate">
                  <MapPin size={14} strokeWidth={2} className="text-[#b1b5bd] shrink-0" />
                  <span className="truncate">
                    {collection.project.name} 
                    {collection.project.address ? ` • ${collection.project.address}` : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            {collection.items && collection.items.length > 0 ? (
              <div className="columns-1 md:columns-2 xl:columns-3 gap-6 pt-2 pb-16">
                {collection.items.map((item) => (
                  <div
                    key={item.id}
                    className="relative break-inside-avoid mb-6 rounded-3xl overflow-hidden border-2 border-transparent shadow-sm bg-white group"
                  >
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.metadata?.aesthetic || item.type}
                        width={item.width || 1200}
                        height={item.height || 800}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                      />
                    )}

                    {showLabels && (
                      <div className={`absolute top-4 right-4 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full shadow-sm ${
                        item.type === "ORIGINAL" 
                          ? "bg-black/70 text-white" 
                          : "bg-white/90 text-[#1a1a1a]"
                      }`}>
                        {item.type === "ORIGINAL" ? "Original" : item.metadata?.aesthetic || "Restyled"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-4xl p-12 text-center min-h-100 flex flex-col items-center justify-center">
                <p className="text-[#8e94a0]">This collection has no images yet.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="w-85 shrink-0 sticky top-8 flex flex-col gap-6">
          <div className="bg-white rounded-4xl border border-gray-100 shadow-sm p-7">
            <h2 className="text-[24px] font-luxury-serif text-[#1a1a1a] mb-6">Share & Export</h2>

            <div className="flex flex-col gap-4 mb-8">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[13px] font-medium text-[#4b5563] group-hover:text-[#1a1a1a] transition-colors">
                  Include Image Labels
                </span>
                <div className={`w-11 h-6 rounded-full transition-colors relative ${showLabels ? "bg-[#8ea28d]" : "bg-gray-200"}`}>
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={showLabels} 
                    onChange={() => setShowLabels(!showLabels)} 
                  />
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${showLabels ? "translate-x-5" : "translate-x-0"}`} />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[13px] font-medium text-[#4b5563] group-hover:text-[#1a1a1a] transition-colors">
                  Include Agent Profile
                </span>
                <div className={`w-11 h-6 rounded-full transition-colors relative ${showAgentProfile ? "bg-[#8ea28d]" : "bg-gray-200"}`}>
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={showAgentProfile} 
                    onChange={() => setShowAgentProfile(!showAgentProfile)} 
                  />
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${showAgentProfile ? "translate-x-5" : "translate-x-0"}`} />
                </div>
              </label>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleGenerateLink}
                disabled={shareMutation.isPending}
                className={`w-full py-3.5 rounded-full font-medium text-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm border ${
                  copied 
                    ? "bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]" 
                    : "bg-white border-gray-200 text-[#1a1a1a] hover:bg-gray-50"
                }`}
              >
                {shareMutation.isPending ? (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-[#1a1a1a] animate-spin" />
                ) : copied ? (
                  <>
                    <Check size={16} strokeWidth={2.5} />
                    Copied to Clipboard
                  </>
                ) : collection.shareId ? (
                  <>
                    <Copy size={16} strokeWidth={2} />
                    Copy Web Link
                  </>
                ) : (
                  <>
                    <LinkIcon size={16} strokeWidth={2} />
                    Generate Web Link
                  </>
                )}
              </button>

              <button
                onClick={handleExportPDF}
                className="w-full py-3.5 rounded-full bg-[#2d2d2d] text-white font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] shadow-md"
              >
                <Download size={16} strokeWidth={2} />
                Export as PDF
              </button>
            </div>
          </div>

          {collection.shareId && (
            <div className="bg-[#f0f4ef] rounded-3xl p-5 border border-[#dce5da] flex items-start gap-3">
              <Globe size={18} className="text-[#6b7b6a] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[13px] font-bold text-[#4a5849] mb-1">Link is Active</h4>
                <p className="text-[12px] text-[#6b7b6a] leading-relaxed">
                  Anyone with the link can view this collection. You can share it directly with your clients.
                </p>
              </div>
            </div>
          )}
        </aside>

      </main>
    </div>
  );
}