import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl } from "../backendUrl";
import { Box, Modal, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface questionsType {
  _id: string;
  question: string;
  answer: string;
  response: string;
  score: number;
  reference: string[];
}

const Chat = () => {

    const [questions, setQuestions] = useState<questionsType[]>([]);
    const [inputValue, setInputValue] = useState("");
    const[ isLoading, setIsLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [references, setReferences] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
      
    const fetchQuestions = async () => {
        setIsLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/chat/questions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        console.log(response.data.chat.questions);
        if(response.data.chat.questions.length === 0){
           throw new Error("No questions found");
        }
        setQuestions(response.data.chat.questions);
       let foundUnanswered = false;

      for (let i = 0; i < response.data.chat.questions.length; i++) {
        if (!response.data.chat.questions[i].answer) {
          console.log("Setting current question to:", i);
          setCurrentQuestion(i);
          foundUnanswered = true;
          break; // exit loop early
        }
      }

      // If all questions are answered
      if (!foundUnanswered) {
        setCurrentQuestion(response.data.chat.questions.length);
        console.log("All questions answered. Setting current question to:", response.data.chat.questions.length);
      }
      } catch (error) {
        toast.error('Error fetching questions');
        console.error('Error fetching questions:', error);
      }
      finally{
        setIsLoading(false);
      }
    };
    fetchQuestions();
    }, [])

    const handleSubmit = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${backendUrl}/api/chat/query`, {
          answer: inputValue,
          questionId: questions[currentQuestion]._id,
        },
        {
          headers:{
            "Authorization": `Bearer ${localStorage.getItem('token') || ''}`,
          }
        });
        console.log(response.data);
        setQuestions(response.data.currentChat.questions);
        setCurrentQuestion(currentQuestion+1);
      } catch (error) {
        toast.error('Error evaluating answer');
        console.error('Error evaluating answer:', error);
      }
      finally{
        setIsLoading(false);
        setInputValue("");
      }
    };

    const handleViewReference = async (questionId: string) => {
      const question = questions.find(q => q._id === questionId);
      console.log(question);
      setReferences(question?.reference || []);
      handleOpen();
    }

    const MessageBox = ({message, role, questionId }: { message: string, role: string , questionId: string }) => (
        <div
            className={`flex ${role==='answer' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl rounded-lg px-4 py-3 ${
                role === 'answer'
                  ? 'bg-blue-600 text-white ml-4'
                  : role === 'question'
                  ? 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                  : role === 'response'
                  ? 'bg-green-50 text-green-900 border border-green-200'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
               
                <div className="flex-1">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message}
                  </p>
                  {
                    role === 'response' ?(
                      <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-600 transition"
                      onClick={() => handleViewReference(questionId)}
                      >
                        View Reference
                      </button>
                    ):null
                  }
                  {/* <p className="text-xs opacity-75 mt-1">
                    {message.timestamp}
                  </p> */}
                </div>
              </div>
            </div>
          </div>
    )

    const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  height:500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
};

    

  return (
    <>
     <div className="flex flex-col flex-1  overflow-y-auto justify-between">
        {/* Messages */}
      <div className="flex-1  p-4 space-y-4">
    {questions.slice(0, currentQuestion).map((question) => (
            <>
          <MessageBox  message={question.question} role="question" questionId={question._id} />
          <MessageBox   message={question.answer} role="answer" questionId={question._id} />
          <MessageBox   message={question.response +`\n Score : ${question.score}`} questionId={question._id} role="response" />
          
        </>
        ))}
        {(currentQuestion !== questions.length) ? <MessageBox  message={questions[currentQuestion ]?.question} role="question" questionId={questions[currentQuestion ]._id} /> : null}
        {/* <div ref={messagesEndRef} /> */}
        {
        isLoading && <div>
        <span className="text-yellow-700 p-2 rounded-2xl bg-amber-100 flex"><Loader2 className="w-5 h-5 animate-spin"/> Ai is Generating Response...</span>
      </div>
      }
      </div>
       
    </div>
     {/* Input Box */}
          <div className="border-t border-gray-200 p-4">
        <form  className="flex space-x-2">
         
          <input type="text"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your answer..."
                value={inputValue}
                onChange={(e)=>setInputValue(e.target.value)}
                disabled={currentQuestion >= questions.length  || isLoading}
          />
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            // disabled={!inputValue.trim() || disabled}
                disabled={currentQuestion >= questions.length  || isLoading}
            onClick={handleSubmit}
          >
            Send
          </button>
        </form>
      </div>

      {/* Modal */}

      <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}
  >
    <Typography id="modal-modal-title" variant="h6" component="h2">
      References
    </Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      {references.length === 0 ? (
        <p>No references available.</p>
      ) : (
        references.map((reference, index) => (
          <p key={index} className=" pb-4">{index+1} - {reference}</p>
        ))
      )}
    </Typography>
  </Box>
</Modal>
        
    </>
  )
}

export default Chat