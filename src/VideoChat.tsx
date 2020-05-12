import React, { useEffect, useState } from "react";
import SimplePeer from "simple-peer";
import "./App.css";

function VideoChat() {
  const [Peer, setPeer] = useState({});
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(initPeerListeners)
      .catch((err) => console.error(err));
    return () => {
      // cleanup
    };
  }, []);

  const initPeerListeners = (stream) => {
    const peer = new SimplePeer({
      initiator: window.location.hash === "#init",
      trickle: false,
      stream: stream,
    });

    setPeer(peer);

    console.log("Peer SET!");

    peer.on("signal", (data) => {
      console.log("SIGNAL", JSON.stringify(data));
      const yourIdElem = document.getElementById("yourId") as HTMLInputElement;
      if (yourIdElem) {
        yourIdElem.value = JSON.stringify(data);
      }
    });

    peer.on("data", (data) => {
      const messagesElem = document.getElementById("messages") as HTMLElement;
      messagesElem.textContent += data + "\n";
    });

    peer.on("stream", (stream) => {
      const video = document.createElement("video");
      const videoContainerElem = document.getElementById(
        "videoContainer"
      ) as HTMLElement;
      videoContainerElem.appendChild(video);

      video.srcObject = stream;
      video.play();
    });
  };

  const connectPeers = (e) => {
    const otherIdElem = document.getElementById("otherId") as HTMLInputElement;
    const otherIdValue = JSON.parse(otherIdElem.value);
    Peer.signal(otherIdValue);
  };

  const sendMessage = (e) => {
    const messageElem = document.getElementById(
      "yourMessage"
    ) as HTMLInputElement;
    const message = messageElem.value;
    Peer.send(message);
  };

  return (
    <div className="screen">
      <h1>VideoChat</h1>
      <div id="videoContainer" />
      <div className="user-inputs flex-column">
        <label htmlFor="yourId">Your Id:</label>
        <textarea id="yourId" />
        <label htmlFor="otherId">other Id:</label>
        <textarea id="otherId" />
        <button id="connect" onClick={(e) => connectPeers(e)}>
          Connect!
        </button>
      </div>

      <div className="message-form flex-column">
        <label htmlFor="otherId">Enter Message:</label>
        <textarea id="yourMessage" />
        <button id="send" onClick={(e) => sendMessage(e)}>
          Send
        </button>
        <pre id="messages"></pre>
      </div>
    </div>
  );
}

export default VideoChat;
