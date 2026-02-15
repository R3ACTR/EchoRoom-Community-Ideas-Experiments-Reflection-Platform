import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "./ui/Button";

export default function BackButton({ label = "Back to Home" }) {
  const router = useRouter();

  return (
    <Button onClick={() => router.push("/")}>
      <span className="flex items-center gap-2">
        <ArrowLeft size={18} />
        {label}
      </span>
    </Button>
  );
}
