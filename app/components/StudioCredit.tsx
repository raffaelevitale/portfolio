import type { ShowcaseItem } from "@/lib/studio-content";

export function PhotoCredit({ item }: { item: ShowcaseItem }) {
  if (!item.photo || !item.photoCredit || !item.photoLicense) return null;
  return (
    <small className="studio-credit">
      {item.photoSource ? <a href={item.photoSource} target="_blank" rel="noreferrer">{item.photoCredit}</a> : item.photoCredit}
      {" · "}{item.photoLicenseUrl ? <a href={item.photoLicenseUrl} target="_blank" rel="noreferrer">{item.photoLicense}</a> : item.photoLicense}{" · ridimensionata"}
    </small>
  );
}
