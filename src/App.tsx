import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "./components/ui/card";
import { ButtonGroup } from "./components/ui/button-group";
import { Button } from "./components/ui/button";
import qrcode from "qrcode-generator";
import { QrCode as QrPlaceholder } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "./components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { InputGroup } from "./components/ui/input-group";

function App() {
  const [qrOutput, setQrOutput] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    const userInput = inputRef.current?.value as string;

    setQrOutput("");

    try {
      const generator = qrcode(0, "H");
      generator.addData(userInput);
      generator.make();

      const base64Out = generator.createDataURL(4, 2);

      setQrOutput(base64Out);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message && error.message.includes("overflow")) {
          alert("Text is too long, unable to generate QR code.");
        } else {
          alert(error.message);
        }
      } else {
        alert("An unexpected error has occured, sorry boss.");
        console.error(error);
      }
    }
  };

  const handleDownload = () => {
    if (!qrOutput) return;

    const link = document.createElement('a');
    link.href = qrOutput;

    link.download = "qrcode.png";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setQrOutput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGenerate();
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Card>
        <CardHeader>
          <h1>
            <ModeToggle />
          </h1>
          <h2 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            Easy QRCode Generator
          </h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 items-center-safe">
          {qrOutput && (
            <Tooltip>
              <TooltipTrigger asChild>
                <img
                  src={qrOutput}
                  alt="Generated QR Code"
                  style={{
                    maxWidth: "66vh",
                    maxHeight: "66vh",
                    width: "auto",
                    height: "auto",
                    border: "1px solid #ddd",
                    imageRendering: "pixelated",
                  }}
                ></img>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click the Download button to save this QR code.</p>
              </TooltipContent>
            </Tooltip>
          )}
          {!qrOutput && (
            <Tooltip>
              <TooltipTrigger asChild>
                <QrPlaceholder></QrPlaceholder>
              </TooltipTrigger>
              <TooltipContent>
                <p>Placeholder!</p>
              </TooltipContent>
            </Tooltip>
          )}
          <CardAction className="min-w-full">
            <InputGroup>
              <Input
                ref={inputRef}
                type="text"
                placeholder="Enter text or URL to generate QR Code"
                onKeyDown={handleKeyDown}
              ></Input>
              <ButtonGroup>
                <Button onClick={handleGenerate}>Generate</Button>
                <Button disabled={!qrOutput} onClick={handleDownload}>Download</Button>
                <Button disabled={!qrOutput} onClick={handleClear}>Clear</Button>
              </ButtonGroup>
            </InputGroup>
          </CardAction>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

export default App;
