import React, { type FormEvent } from 'react'
import Navbar from '~/components/Navbar'
import { useState } from 'react'
import FileUploader from '~/components/FileUploader';
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from '~/lib/pdf2img';
import { generateUUID } from '~/lib/utils';
import { prepareInstructions } from "../../constants";

const upload = () => {
     const { auth, isLoading, fs, ai, kv } = usePuterStore();
     const navigate = useNavigate();
     const [isProcessing, setIsProcessing] = useState(false);
     const [statusText, setStatusText] = useState("");
     const [file, setFile] = useState<File | null>(null);
     const handleFileSelect = (file: File | null) => {
          setFile(file)
     }
     const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
          setIsProcessing(true);
          setStatusText('Uploading the file.....');
          const uploadedFile = await fs.upload([file]);

          if (!uploadedFile) return setStatusText('Error: Failed to upload file');

          setStatusText('converting to image....');
          const imageFile = await convertPdfToImage(file);
          if (!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

          setStatusText('Uploading the image....');
          const uploadedImage = await fs.upload([imageFile.file]);
          if (!uploadedImage) return setStatusText('Error: Failed to upload image...');

          setStatusText('Extracting text...');
          let extractedText = "";
          try {
               const { extractTextFromPdf } = await import("~/lib/pdf-text");
               extractedText = await extractTextFromPdf(file);
          } catch (e) {
               console.error("Text extraction failed", e);
               setStatusText('Error: Failed to extract text');
               return;
          }

          setStatusText('preparing data...');

          const uuid = generateUUID();

          const data: any = {
               id: uuid,
               resumePath: uploadedFile.path,
               imagePath: uploadedImage.path,
               companyName,
               jobTitle,
               jobDescription,
               feedback: '',
          }
          await kv.set(`resume:${uuid}`, JSON.stringify(data));
          setStatusText('Analying...')

          const prompt = `
You are an expert ATS (Applicant Tracking System) and resume analyzer.
Your goal is to evaluate the resume against the provided Job Description and Title.

Job Title: ${jobTitle}
Company: ${companyName}
Job Description: ${jobDescription}

Analyze the following resume text like an ATS system.

Evaluate based on:
- Skills matching the job description
- Projects relevance
- Experience impact
- Education
- Keywords relevance
- Clarity and formatting

Generate:
- Overall ATS Score out of 100
- Top Strengths (3–5 points)
- Weaknesses or Missing Sections
- Suggestions to improve resume for tech roles

Return strictly in JSON format:
{
  "score": number,
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": string[]
}

Resume Text:
${extractedText}
          `;

          const feedback = await ai.chat(prompt);

          if (!feedback) return setStatusText('Error: Failed to analyze resume');

          let feedbackText = "";
          if (typeof feedback === 'string') {
               feedbackText = feedback;
          } else if ('message' in feedback && typeof feedback.message.content === 'string') {
               feedbackText = feedback.message.content;
          } else if ('message' in feedback && Array.isArray(feedback.message.content)) {
               feedbackText = feedback.message.content[0].text;
          }

          try {
               // Clean up markdown code blocks if present
               feedbackText = feedbackText.replace(/```json/g, '').replace(/```/g, '').trim();
               const simpleFeedback = JSON.parse(feedbackText);

               // Map simple feedback to complex UI structure
               const mappedFeedback = {
                    overallScore: simpleFeedback.score,
                    ATS: {
                         score: simpleFeedback.score,
                         tips: [
                              ...simpleFeedback.strengths.map((s: string) => ({ type: "good", tip: "Strength", explanation: s })),
                              ...simpleFeedback.suggestions.map((s: string) => ({ type: "improve", tip: "Suggestion", explanation: s }))
                         ]
                    },
                    toneAndStyle: {
                         score: Math.max(0, simpleFeedback.score - 5),
                         tips: simpleFeedback.weaknesses.map((s: string) => ({ type: "improve", tip: "Weakness", explanation: s }))
                    },
                    content: {
                         score: simpleFeedback.score,
                         tips: simpleFeedback.strengths.map((s: string) => ({ type: "good", tip: "Good Content", explanation: s }))
                    },
                    structure: {
                         score: simpleFeedback.score,
                         tips: simpleFeedback.suggestions.slice(0, 2).map((s: string) => ({ type: "improve", tip: "Structure Tip", explanation: s }))
                    },
                    skills: {
                         score: simpleFeedback.score,
                         tips: simpleFeedback.strengths.map((s: string) => ({ type: "good", tip: "Skill Strength", explanation: s }))
                    }
               };

               data.feedback = mappedFeedback;
               await kv.set(`resume:${uuid}`, JSON.stringify(data));
               setStatusText('Analysis Complete, redirecting..')
               console.log(data);
               navigate(`/resume/${uuid}`);
          } catch (e) {
               console.error("JSON parse error", e);
               setStatusText('Error: Failed to parse analysis result');
          }
     }
     const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const form = e.currentTarget.closest('form');
          if (!form) return;
          const formData = new FormData(form);


          const companyName = formData.get('company-name') as string;
          const jobTitle = formData.get('job-title') as string;
          const jobDescription = formData.get('job-description') as string;

          if (!file) return;

          handleAnalyze({
               companyName, jobTitle, jobDescription,
               file
          })
     }
     return (
          <main className="bg-[url('/images/bg-main.svg')] bg-cover">
               <Navbar />

               <section className="main-section">
                    <div className="page-heading py-16">
                         <h1>Unlock game-changing insights to supercharge your job search.</h1>
                         {isProcessing ? (
                              <>
                                   <h2>{statusText}</h2>
                                   <img src="/images/resume-scan.gif" className="w-full" alt="Resume scanning animation" />
                              </>
                         ) : (
                              <h2>Drop your resume for an ATS score and improvement tips</h2>
                         )}
                         {!isProcessing && (
                              <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8 w-full max-w-2xl">
                                   <div className="form-div">
                                        <label htmlFor="company-name">Company Name</label>
                                        <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                                   </div>
                                   <div className="form-div">
                                        <label htmlFor="job-title">Job Title</label>
                                        <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                                   </div>
                                   <div className="form-div">
                                        <label htmlFor="job-description">Job Description</label>
                                        <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                                   </div>
                                   <div className="form-div">
                                        <label htmlFor="uploader">Upload Resume</label>
                                        <FileUploader onFileSelect={handleFileSelect} />
                                   </div>



                                   <button className="primary-button" type="submit">
                                        Analyze Resume
                                   </button>
                              </form>
                         )}
                    </div>
               </section>
          </main>
     )
}

export default upload