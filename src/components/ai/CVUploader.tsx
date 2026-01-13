import { useState, useRef } from "react";
import { Upload, FileText, X, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import mammoth from "mammoth";
import { supabase } from "@/integrations/supabase/client";

// Set up PDF.js worker using a bundled asset (avoids CDN/CORS/dynamic import issues)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

interface CVUploaderProps {
  onTextExtracted: (text: string) => void;
  currentText: string;
}

export function CVUploader({ onTextExtracted, currentText }: CVUploaderProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n\n";
    }

    return fullText.trim();
  };

  const extractTextFromTxt = async (file: File): Promise<string> => {
    return await file.text();
  };

  const extractTextFromWord = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  };

  const performOCR = async (file: File): Promise<string> => {
    setIsOCRProcessing(true);
    toast.info("PDF appears to be image-based. Running OCR...");
    
    try {
      // Convert file to base64
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const { data, error } = await supabase.functions.invoke("pdf-ocr", {
        body: { pdfBase64: base64, filename: file.name },
      });

      if (error) {
        console.error("OCR error:", error);
        throw new Error(error.message || "OCR failed");
      }

      if (!data?.text) {
        throw new Error("No text extracted from OCR");
      }

      return data.text;
    } finally {
      setIsOCRProcessing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.txt')) {
      toast.error("Please upload a PDF, TXT, or Word document");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    setIsExtracting(true);
    setFileName(file.name);

    try {
      let extractedText = "";

      if (file.type === "application/pdf") {
        // Try standard text extraction first
        try {
          extractedText = await extractTextFromPDF(file);
        } catch (pdfError) {
          console.error("Standard PDF extraction failed:", pdfError);
          extractedText = "";
        }

        // If too little text extracted, try OCR fallback
        if (extractedText.trim().length < 50) {
          console.log("Standard extraction yielded too little text, trying OCR...");
          try {
            extractedText = await performOCR(file);
          } catch (ocrError) {
            console.error("OCR failed:", ocrError);
            toast.error("Could not extract text from PDF. Please paste your CV manually.");
            setFileName(null);
            return;
          }
        }
      } else if (file.type === "text/plain" || file.name.endsWith('.txt')) {
        extractedText = await extractTextFromTxt(file);
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.endsWith('.docx')
      ) {
        extractedText = await extractTextFromWord(file);
      } else if (file.type === "application/msword" || file.name.endsWith('.doc')) {
        toast.info("Legacy .doc format not supported. Please save as .docx or paste text manually.");
        setIsExtracting(false);
        setFileName(null);
        return;
      }

      if (extractedText.trim().length < 50) {
        toast.error("Could not extract enough text from the file. Please paste your CV manually.");
        setFileName(null);
      } else {
        onTextExtracted(extractedText);
        toast.success("CV text extracted successfully!");
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      toast.error("Failed to extract text. Please paste your CV manually.");
      setFileName(null);
    } finally {
      setIsExtracting(false);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearFile = () => {
    setFileName(null);
    onTextExtracted("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isProcessing = isExtracting || isOCRProcessing;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
          id="cv-upload"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isOCRProcessing ? "Running OCR..." : "Extracting..."}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload CV
            </>
          )}
        </Button>
        <span className="text-xs text-muted-foreground">PDF, DOCX, or TXT (max 10MB)</span>
      </div>

      {isOCRProcessing && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50 border border-accent">
          <Eye className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm text-card-foreground">
            Scanning image-based PDF with AI OCR...
          </span>
        </div>
      )}

      {fileName && !isProcessing && (
        <div className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "bg-primary/5 border border-primary/20"
        )}>
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-sm text-card-foreground flex-1 truncate">{fileName}</span>
          <button
            onClick={clearFile}
            className="p-1 hover:bg-destructive/10 rounded transition-colors"
          >
            <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      )}
    </div>
  );
}
