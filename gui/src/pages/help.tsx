import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Button,
  Hr,
  lightGray,
  vscBackground,
  vscForeground,
} from "../components";
import KeyboardShortcutsDialog from "../components/dialogs/KeyboardShortcuts";
import { useNavigationListener } from "../hooks/useNavigationListener";
import { postToIde } from "../util/ide";

const ResourcesDiv = styled.div`
  margin: 4px;
  border-top: 0.5px solid ${lightGray};
  border-bottom: 0.5px solid ${lightGray};
`;

const IconDiv = styled.div<{ backgroundColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  padding: 12px;

  & > a {
    color: ${vscForeground};
    text-decoration: none;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
  }

  &:hover {
    background-color: ${(props) => props.backgroundColor || lightGray};
  }
`;

const TutorialButton = styled(Button)`
  padding: 2px 4px;
  margin-left: auto;
  margin-right: 12px;
  background-color: transparent;
  color: ${vscForeground};
  border: 1px solid ${lightGray};
  &:hover {
    background-color: ${lightGray};
  }
`;

function HelpPage() {
  useNavigationListener();
  const navigate = useNavigate();

  return (
    <div className="overflow-y-scroll overflow-x-hidden">
      <div
        className="items-center flex m-0 p-0 sticky top-0"
        style={{
          borderBottom: `0.5px solid ${lightGray}`,
          backgroundColor: vscBackground,
        }}
      >
        <ArrowLeftIcon
          width="1.2em"
          height="1.2em"
          onClick={() => navigate("/")}
          className="inline-block ml-4 cursor-pointer"
        />
        <h3 className="text-lg font-bold m-2 inline-block">帮助中心</h3>
      </div>

      <h3
        className="my-0 py-3 mx-auto text-center cursor-pointer"
        onClick={() => {
          navigate("/stats");
        }}
      >
        查看我的使用情况
      </h3>
      <Hr className="my-0" />

      <KeyboardShortcutsDialog />
    </div>
  );
}

export default HelpPage;
