const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const status = document.getElementById("status");

let recorder = null;
let chunks = [];
let stream = null;

startBtn.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
      preferCurrentTab: false
    });

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      status.textContent = "エラー: 音声が含まれていません。「タブの音声も共有する」をONにしてください。";
      stream.getTracks().forEach(t => t.stop());
      return;
    }

    // 音声のみのストリームに絞る
    const audioStream = new MediaStream(audioTracks);
    stream.getVideoTracks().forEach(t => t.stop());

    chunks = [];
    recorder = new MediaRecorder(audioStream, { mimeType: "audio/webm" });
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => saveFile();
    recorder.start(1000);

    startBtn.style.display = "none";
    stopBtn.style.display = "block";
    status.textContent = "録音中...";
  } catch (e) {
    status.textContent = "エラー: " + e.message;
  }
});

stopBtn.addEventListener("click", () => {
  if (recorder && recorder.state !== "inactive") {
    recorder.stop();
    stream?.getTracks().forEach(t => t.stop());
  }
  stopBtn.style.display = "none";
  startBtn.style.display = "block";
  status.textContent = "保存中...";
});

function saveFile() {
  const blob = new Blob(chunks, { type: "audio/webm" });
  const url = URL.createObjectURL(blob);
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const a = document.createElement("a");
  a.href = url;
  a.download = `recording-${ts}.webm`;
  a.click();
  status.textContent = "保存しました";
}
