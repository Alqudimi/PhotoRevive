import { Hero } from "../Hero";

export default function HeroExample() {
  return (
    <Hero 
      onUploadClick={() => console.log("Upload clicked")}
      onExamplesClick={() => console.log("Examples clicked")}
    />
  );
}
