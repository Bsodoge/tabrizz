import { useEffect, useState } from "react";
import EmojiSelector from "../components/EmojiSelector";
import TimeInterval from "../components/TimeInterval";
import WebsiteTab from "../components/WebsiteTab";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import { backendUrl } from "../utils/common";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const location = useNavigate();
  const [emojiState, setEmojiState] = useState<string[]>([]);
  const [timeInterval, setTimeInterval] = useState(1);
  const [showGenerateScriptModal, setShowGenerateScriptModal] = useState(false);
  const [copy, setCopy] = useState(false);

  const {
    response: addDataResponse,
    error: addDataError,
    isLoading: addDataLoading,
    refetchData: refetchAddData,
  } = useApi({ url: `${backendUrl}/users/add-data` });

  useEffect(() => {
    
    if (!isLoading && !user) {
      location("/login");
    }
  }, [user,isLoading]);

  const generateScript = async () => {
    if (emojiState.length === 0) {
      alert("Please select atleast one emoji");
      return;
    }
    const data = {
      emojis: emojiState,
      intervalTime: timeInterval,
    };
    await refetchAddData("POST", true, data);
  };

  const handleCopy = () => {
    setCopy(true);
    setTimeout(() => {
      setEmojiState([]);
      setTimeInterval(1);
      setShowGenerateScriptModal(false);
      setCopy(false);
    }, 1000); 
  };

  useEffect(() => {
    setShowGenerateScriptModal(false);
    if (addDataError) {
      alert("Error while generating script");
    }
    if (addDataResponse) {
      setShowGenerateScriptModal(true);
    }
  }, [addDataLoading, addDataResponse, addDataError]);

  return (
    <div className="bg-primary  text-white pt-20 lg:pt-0">
      <div className=" text-center text-xl lg:text-6xl min-h-[40%]">
        <span className="hover:text-yellow-500">Rizz</span> Up Your{" "}
        <span className="hover:text-yellow-500">Tab.</span>
      </div>
      {showGenerateScriptModal && addDataResponse && (
        <div className="lg:min-w-[50%] lg:min-h-[50%] lg:top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 top-[100%] w-[100%] lg:w-auto z-30 items-center absolute bg-gray-700 rounded-3xl shadow-2xl ">
          <div className="p-4 flex flex-col gap-20 justify-between">
            <div className="flex lg:justify-between">
            <div className="text-xl lg:text-3xl">Script Generated Successfully</div>
            <button className="p-2" onClick={()=>setShowGenerateScriptModal(false)}>❌</button>
            </div>
            <div className="text-lg lg:text-xl">
              Copy the below script and paste it in your website. If you already generated a script, the previous script will be replaced.
            </div>
            <div className="flex gap-2 justify-between">
              <CopyToClipboard text={addDataResponse} onCopy={handleCopy}>
                <button className=" border p-5 rounded-3xl pt-5 lg:w-[50%] bg-gray-700 hover:bg-primary hover:text-yellow-500">
                  {copy ? "Copied✨" : "Copy Script"}
                </button>
              </CopyToClipboard>
              <div className="p-4 lg:max-w-[70%] bg-primary rounded-lg flex">
                {addDataResponse}
              </div>
            </div>
        </div>
        </div>
      )}
      <div className="pt-10 grid items-start lg:grid-cols-3 gap-[10%]">
        <WebsiteTab />
        <EmojiSelector emojiState={emojiState} setEmojiState={setEmojiState} />
        <TimeInterval
          setTimeInterval={setTimeInterval}
          timeInterval={timeInterval}
        />
      </div>
      <div className="w-full flex justify-center mt-10 pb-20 lg:pb-0">
        <button
          className="text-2xl border p-5 rounded-3xl pt-5 bg-gray-700 hover:bg-primary hover:text-yellow-500"
          onClick={generateScript}
          disabled={addDataLoading || showGenerateScriptModal}
        >
         { addDataLoading ? 'Generating 🔥' : 'Generate Script ✨'}
        </button>
      </div>
    </div>
  );
}
