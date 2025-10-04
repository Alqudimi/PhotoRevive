import { ComparisonSlider } from "../ComparisonSlider";
import beforeImage from "@assets/generated_images/Old_faded_portrait_woman_8dd55ebe.png";
import afterImage from "@assets/generated_images/Restored_colorized_portrait_woman_b504a183.png";

export default function ComparisonSliderExample() {
  return (
    <div className="p-8">
      <ComparisonSlider
        beforeImage={beforeImage}
        afterImage={afterImage}
        onDownload={() => console.log("Download clicked")}
        onRestoreAnother={() => console.log("Restore another clicked")}
      />
    </div>
  );
}
