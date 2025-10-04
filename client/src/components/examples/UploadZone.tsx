import { UploadZone } from "../UploadZone";

export default function UploadZoneExample() {
  return (
    <div className="p-8">
      <UploadZone onFileSelect={(file) => console.log("File selected:", file.name)} />
    </div>
  );
}
