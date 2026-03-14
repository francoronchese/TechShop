export const ProductDescriptionBlock = ({ description }) => (
  <div className="p-6 bg-white border border-slate-200 rounded-xl">
    <h2 className="mb-3 text-slate-900 text-lg font-bold">About this product</h2>
    {/* If description uses bullet points, split and render each as a list item */}
    {description.includes("•") ? (
      <ul className="space-y-2">
        {description
          .split("•")
          .filter((item) => item.trim() !== "")
          .map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-slate-600"
            >
              <span className="mt-0.5 shrink-0 text-orange-500">•</span>
              <span>{item.trim()}</span>
            </li>
          ))}
      </ul>
    ) : (
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    )}
  </div>
);