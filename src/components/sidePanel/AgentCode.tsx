import * as Dialog from "@radix-ui/react-dialog";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { useAtom } from "jotai";
import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { agentCodeAtom } from "../../states/agentCode";
import agentpy from "../../pysrc/agent.py?raw";

export function AgentCode() {
  const [agentCode, setAgentCode] = useAtom(agentCodeAtom);

  function handleSubmit(newCode: string) {
    setAgentCode(newCode);
    console.log("SAVE!", newCode);
  }

  return (
    <div className="flex rounded-lg gap-2 m-2 p-2 bg-zinc-500">
      <CodeEditorModal value={agentCode} onSubmit={handleSubmit} />
    </div>
  );
}

const CodeEditorModal = (props: {
  value: string;
  onSubmit: (value: string) => void;
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [edited, setEdited] = useState(false);

  function handleSubmit() {
    const code = editorRef.current?.getValue() ?? "";
    props.onSubmit(code);
    setEdited(false);
  }

  function handleChange() {
    setEdited(true);
  }

  function handleEditorMount(editor: editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
    editor.setValue(props.value);
  }

  function handleReset() {
    if (confirm("정말 agent.py 의 내용을 초기값으로 바꿀까요?")) {
      editorRef.current?.setValue(agentpy);
      setEdited(false);
      props.onSubmit(agentpy);
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-violet4 shadow-blackA7 hover:bg-violet9 flex h-[35px] items-center justify-center rounded-[4px] bg-violet10 px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none">
          <span className="mr-1">{editIcon}</span>
          <span>agent.py</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="w-10/12 h-5/6 flex flex-col data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-gray-700 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve5 m-0 ml-4 text-xl font-medium h-12 flex items-center">
            agent.py
            <span className="ml-3 text-xs text-mauve8">
              {edited && "(Editing)"}
            </span>
          </Dialog.Title>
          <div className="grow">
            <Editor
              defaultLanguage="python"
              height="100%"
              theme="vs-dark"
              onMount={handleEditorMount}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between p-2">
            <button
              className="bg-mauve4 text-red11 hover:bg-red3 focus:shadow-red7 disabled:bg-mauve9 disabled:text-mauve8 py-2 items-center justify-center rounded px-4 font-medium focus:shadow-[0_0_0_2px] focus:outline-none"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 disabled:bg-mauve9 disabled:text-mauve8 py-2 items-center justify-center rounded px-4 font-medium focus:shadow-[0_0_0_2px] focus:outline-none"
              disabled={!edited}
              onClick={handleSubmit}
            >
              Save changes
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-mauve3 hover:bg-violet8 focus:shadow-violet8 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const editIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
    <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
  </svg>
);
