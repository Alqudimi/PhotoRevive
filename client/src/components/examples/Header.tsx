import { Header } from "../Header";

export default function HeaderExample() {
  return <Header onUploadClick={() => console.log("Upload clicked")} />;
}
