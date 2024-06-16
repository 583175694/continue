import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { greenButtonColor } from "../../components";
import { postToIde } from "../../util/ide";
import { setLocalStorage } from "../../util/localStorage";
import { Div, StyledButton } from "./components";

function Onboarding() {
  const navigate = useNavigate();

  const [hovered0, setHovered0] = useState(false);
  const [hovered1, setHovered1] = useState(false);
  const [hovered2, setHovered2] = useState(false);

  const [selected, setSelected] = useState(-1);

  return (
    <div className="p-2 max-w-96 mt-16 mx-auto">
      <h1 className="text-center">Welcome to CodeMaster</h1>
      <p className="text-center pb-2">
        Let's find the setup that works best for you
      </p>
      <Div
        color={"#1b84be"}
        disabled={false}
        selected={selected === 2}
        hovered={hovered2}
        onMouseEnter={() => setHovered2(true)}
        onMouseLeave={() => setHovered2(false)}
        onClick={() => {
          setSelected(2);
          postToIde("openConfigJson", undefined);
        }}
      >
        <h3>⚙️ Your own models</h3>
        <p>
          CodeMaster lets you use your own API key or self-hosted LLMs.{" "}
          <a href="http://tcftp.weoa.com/code-master/">
            Read the docs
          </a>{" "}
          to learn more about using config.json to customize CodeMaster. This can
          always be done later.
        </p>
      </Div>
      {selected === 2 && (
        <p className="px-3">
          Use <code>config.json</code> to configure your own{" "}
          <a href="https://docs.continue.dev/model-setup/overview">models</a>,{" "}
          <a href="https://docs.continue.dev/customization/context-providers">
            context providers
          </a>
          ,{" "}
          <a href="https://docs.continue.dev/customization/slash-commands">
            slash commands
          </a>
          , and <a href="https://docs.continue.dev/reference/config">more</a>.
        </p>
      )}

      <br />
      <div className="flex">
        <StyledButton
          blurColor={
            selected === 0
              ? "#be841b"
              : selected === 1
              ? greenButtonColor
              : "#1b84be"
          }
          disabled={selected < 0}
          onClick={() => {
            postToIde("completeOnboarding", {
              mode: ["optimized", "local", "custom"][selected] as any,
            });
            setLocalStorage("onboardingComplete", true);

            if (selected === 1) {
              navigate("/localOnboarding");
            } else {
              // Only needed when we switch from the default (local) embeddings provider
              postToIde("index/forceReIndex", undefined);
              // Don't show the tutorial above yet because there's another step to complete at /localOnboarding
              postToIde("showTutorial", undefined);
              navigate("/");
            }
          }}
        >
          CodeMaster
        </StyledButton>
      </div>
    </div>
  );
}

export default Onboarding;
