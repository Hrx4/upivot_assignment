import { FileText, Loader2 } from 'lucide-react';
import  { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { backendUrl } from '../backendUrl';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Upload = () => {

    const [resume, setResume] = useState<string>('');
  const [jd, setJd] = useState<string>('');
  const [resumeLodaing, setResumeLoading] = useState<boolean>(false);
  const [jdLoading, setJdLoading] = useState<boolean>(false);
  const [resumeDeleteLoading, setResumeDeleteLoading] = useState<boolean>(false);
  const [jdDeleteLoading, setJdDeleteLoading] = useState<boolean>(false);
    const [interviewLoading, setInterviewLoading] = useState<boolean>(false);

  const navigate = useNavigate()
  // handle resume drop
  const onDropResume = useCallback(async(acceptedFiles: File[]) => {
    // setResume(acceptedFiles[0]);
    setResumeLoading(true);
    try {
      const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    formData.append('fileType', 'resume');
    // formData.append('type', 'resume');
    const response = await axios.post(`${backendUrl}/api/document/upload`, formData , {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token') || ''}`,
            "Content-Type": "multipart/form-data"
        }
    });
    console.log(response.data);
    setResume(response.data.documentUrl);
    } catch (error) {
      toast.error('Error uploading resume');
    }
    finally{
      setResumeLoading(false);
    }

  }, []);

  // handle job description drop
  const onDropJD = useCallback(async(acceptedFiles: File[]) => {
    // setJd(acceptedFiles[0]);
    setJdLoading(true);
    try {
      const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    formData.append('fileType', 'jobDescription');
    // formData.append('type', 'resume');
    const response = await axios.post(`${backendUrl}/api/document/upload`, formData , {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token') || ''}`,
            "Content-Type": "multipart/form-data"
        }
    });
    console.log(response.data);
    setJd(response.data.documentUrl);
    } catch (error) {
      toast.error('Error uploading job description');
    }finally{
            setJdLoading(false);

    }

  }, []);

  const {
    getRootProps: getResumeRootProps,
    getInputProps: getResumeInputProps,
    isDragActive: isResumeDragActive,
  } = useDropzone({
    onDrop: onDropResume,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const {
    getRootProps: getJDRootProps,
    getInputProps: getJDInputProps,
    isDragActive: isJDDragActive,
  } = useDropzone({
    onDrop: onDropJD,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const handleStartInterview = async() => {
    // Logic to start the interview
    setInterviewLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/chat/start`, {
        resume: resume,
        jobDescription: jd,
      },
      {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token') || ''}`,
        }
      });
      console.log(response.data);
      navigate('/chat');
    } catch (error) {
      toast.error('Error starting interview');
      console.error('Error starting interview:', error);
    }finally{
      setInterviewLoading(false);
    }
    
  }

  const deleteResume = async() => {
    setResumeDeleteLoading(true);
    try {
      const response = await axios.delete(`${backendUrl}/api/document/delete`, {data:{
        fileType: 'resume',
      },
      
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token') || ''}`,
        }
      });
      console.log(response.data);
      setResume('');
    } catch (error:any) {
      toast.error('Error deleting resume');
      console.error('Error deleting resume:', error);
    }finally{
      setResumeDeleteLoading(false);
    }
  }

  const deleteJD = async() => {
    setJdDeleteLoading(true);
    try {
      const response = await axios.delete(`${backendUrl}/api/document/delete`, {
        data: {
          fileType: 'jobDescription',
        },
        headers:{
            "Authorization": `Bearer ${localStorage.getItem('token') || ''}`,
        }
      });
      console.log(response.data);
      setJd('');
    } catch (error) {
      toast.error('Error deleting job description');
      console.error('Error deleting job description:', error);
    }finally{
      setJdDeleteLoading(false);
    }
  }

  useEffect(() => {
    const fetchDocumentUrls = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/document/getDocumentUrl`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        console.log(response.data);
        setResume(response.data.resume);
        setJd(response.data.jobDescription);
      } catch (error) {
        toast.error('Error fetching document urls');
        console.error('Error fetching document urls:', error);
      }
    };
    fetchDocumentUrls()
  }, [])
  


  return (
    <>
    <h2 className="text-center text-3xl font-bold mb-10">Upload Your Documents</h2>
    <div className="flex flex-col md:flex-row justify-center gap-10 px-6 md:px-16 py-10">
      
  {/* Resume Section */}
  {!resume ? (
    <div
      {...getResumeRootProps()}
      className="w-full md:w-[45%] max-w-xl h-72 border border-dashed flex flex-col p-6 justify-center rounded-2xl items-center text-center bg-white hover:bg-slate-50 transition"
    >
      <input {...getResumeInputProps()} />
      {isResumeDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Resume</h3>
          <p className="text-slate-600 mb-4 text-sm">
            Drag n drop or click to upload your resume (PDF, max 2MB)
          </p>
          {resumeLodaing && <p><Loader2 className=' animate-spin'/></p>}
        </>
      )}
    </div>
  ) : (
    <div className="w-full md:w-[45%] max-w-xl flex flex-col items-center">
      <div className="h-72 border p-4 rounded-2xl flex justify-center text-center overflow-y-scroll w-full bg-white shadow-sm">
        <Document file={resume}>
          <Page pageNumber={1} width={380} />
        </Document>
      </div>
      <button
        className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        onClick={deleteResume}
        disabled={resumeDeleteLoading}
      >
        Delete
      </button>
    </div>
  )}

  {/* Job Description Section */}
  {!jd ? (
    <div
      {...getJDRootProps()}
      className="w-full md:w-[45%] max-w-xl h-72 border border-dashed flex flex-col p-6 justify-center rounded-2xl items-center text-center bg-white hover:bg-slate-50 transition"
    >
      <input {...getJDInputProps()} />
      {isJDDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Job Description
          </h3>
          <p className="text-slate-600 mb-4 text-sm">
            Drag n drop or click to upload your JD (PDF, max 2MB)
          </p>
          {jdLoading && <p><Loader2 className=' animate-spin'/></p>}
        </>
      )}
    </div>
  ) : (
    <div className="w-full md:w-[45%] max-w-xl flex flex-col items-center">
      <div className="h-72 border flex justify-center rounded-2xl text-center overflow-y-scroll w-full bg-white shadow-sm">
        <Document file={jd}>
          <Page pageNumber={1} width={380} />
        </Document>
      </div>
      <button
        className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        onClick={deleteJD}
        disabled={jdDeleteLoading}
      >
        Delete
      </button>
    </div>
  )}
</div>

{
  resume && jd && (
    <div className="flex justify-center py-6">
      <button
        className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition"
        onClick={handleStartInterview}
      >
        { interviewLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <span>Start Interview</span>}
      </button>
    </div>
  )
}

    </>

  ) 
}

export default Upload