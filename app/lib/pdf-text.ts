
let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
     if (pdfjsLib) return pdfjsLib;
     if (loadPromise) return loadPromise;

     isLoading = true;
     // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
     loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
          // Set the worker source to use local file
          lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
          pdfjsLib = lib;
          isLoading = false;
          return lib;
     });

     return loadPromise;
}

export async function extractTextFromPdf(file: File): Promise<string> {
     try {
          const lib = await loadPdfJs();
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
          const maxPages = pdf.numPages;
          let fullText = "";

          for (let i = 1; i <= maxPages; i++) {
               const page = await pdf.getPage(i);
               const textContent = await page.getTextContent();
               const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(" ");
               fullText += pageText + "\n";
          }

          return fullText;
     } catch (err) {
          console.error("Error extracting text from PDF:", err);
          throw new Error(`Failed to extract text: ${err}`);
     }
}
