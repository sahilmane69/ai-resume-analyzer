import ResumeCard from "~/components/ResumeCard";
import { resumes } from "../../constants";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useNavigate} from "react-router";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Resumind is an AI-powered resume analyzer that helps you evaluate and improve your CV for better job opportunities." },
  ];
}

export default function Home() {
    const { auth } = usePuterStore();

     const navigate = useNavigate();

     useEffect(() => {
          if (!auth.isAuthenticated) navigate('/auth?next=/');
     }, [auth.isAuthenticated])
     
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
    <Navbar />
  
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Enhance your resume with AI-powered insights.</h1>
        <h2>Get personalized feedback to make your resume stand out.</h2>
      </div>

      {resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
      </section>
    
  </main>;
}
