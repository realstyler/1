"use client";

export type ScrapedImage = {
  url: string;
  selected: boolean;
};

interface Props {
  scrapedImages: ScrapedImage[];
  onSelectImg: (img: ScrapedImage) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function ScrapedImages({
  scrapedImages,
  onSelectImg,
  onCancel,
  onSubmit,
}: Props) {
  if (scrapedImages.length === 0) return null;

  const selectedCount = scrapedImages.filter((i) => i.selected).length;

  return (
    <section className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-serif">Select Images</h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose the rooms you want to restyle
          </p>
        </div>

        {/* Scrollable grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {scrapedImages.map((img) => (
              <div
                key={img.url}
                onClick={() => onSelectImg(img)}
                className={`relative cursor-pointer group rounded-xl overflow-hidden border transition-all duration-200 ${
                  img.selected
                    ? "border-black ring-2 ring-black"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-48 object-cover"
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                    img.selected
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    {img.selected && (
                      <svg
                        className="w-5 h-5 text-black"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {selectedCount} selected
          </span>

          <div>
            <button
              onClick={onCancel}
              className={"px-6 py-3 cursor-pointer font-medium text-black mr-5"}
            >
              Cancel
            </button>

            <button
              disabled={selectedCount === 0}
              onClick={onSubmit}
              className={`px-6 py-3 cursor-pointer rounded-full font-medium transition ${
                selectedCount > 0
                  ? "bg-black text-white hover:bg-neutral-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
