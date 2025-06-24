import {
  FilesetResolver,
  HandLandmarker,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/vision_bundle.mjs";

let handLandmarker;
let standardLandmarks = [];
let frameScores = [];
let matched = false;
let canvas, ctx;
let bestMatches = [];
let standardPlayTimer = null;

function normalizeLandmarks(landmarks) {
  if (!landmarks || landmarks.length !== 21) return [];
  const base = landmarks[0];
  const normalized = landmarks.map(p => ({
    x: p.x - base.x,
    y: p.y - base.y
  }));
  const scale = Math.sqrt(
    normalized.reduce((sum, p) => sum + p.x * p.x + p.y * p.y, 0) / normalized.length
  );
  return scale > 0 ? normalized.map(p => ({ x: p.x / scale, y: p.y / scale })) : normalized;
}

function drawCenteredLandmarks(ctx, landmarks, width, height) {
  ctx.clearRect(0, 0, width, height);
  const norm = normalizeLandmarks(landmarks);
  const xs = norm.map(p => p.x);
  const ys = norm.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = Math.min(width, height) / Math.max(maxX - minX, maxY - minY) * 0.8;
  const offsetX = width / 2 - (minX + maxX) / 2 * scale;
  const offsetY = height / 2 - (minY + maxY) / 2 * scale;
  const mapped = norm.map(p => ({ x: p.x * scale + offsetX, y: p.y * scale + offsetY }));

  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [0, 9], [9, 10], [10, 11], [11, 12],
    [0, 13], [13, 14], [14, 15], [15, 16],
    [0, 17], [17, 18], [18, 19], [19, 20],
  ];
  ctx.strokeStyle = "#4f46e5";
  ctx.lineWidth = 2;
  connections.forEach(([start, end]) => {
    ctx.beginPath();
    ctx.moveTo(mapped[start].x, mapped[start].y);
    ctx.lineTo(mapped[end].x, mapped[end].y);
    ctx.stroke();
  });
  mapped.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "#1d4ed8";
    ctx.fill();
  });
}

async function playStandardFrames(frames) {
  const canvas = document.getElementById("standardCanvas");
  const ctx = canvas.getContext("2d");
  if (standardPlayTimer) clearInterval(standardPlayTimer);
  let frameIndex = 0;
  standardPlayTimer = setInterval(() => {
    if (!frames[frameIndex]) return;
    drawCenteredLandmarks(ctx, frames[frameIndex], canvas.width, canvas.height);
    frameIndex++;
    if (frameIndex >= frames.length) clearInterval(standardPlayTimer);
  }, 1000);
}

document.getElementById("replayBtn").addEventListener("click", () => {
  playStandardFrames(standardLandmarks);
});

document.getElementById("gestureSelect").addEventListener("change", async function () {
  const word = this.value;
  const res = await fetch(`/static/data/${word}.json`);
  standardLandmarks = await res.json();
  const video = document.getElementById("standardVideo");
  video.src = `/static/videos/${word}.mp4`;
  playStandardFrames(standardLandmarks);
});

function computeScore(user, standard) {
  if (!user || !standard || user.length !== 21 || standard.length !== 21) return 1.0;
  const normUser = normalizeLandmarks(user);
  const normStandard = normalizeLandmarks(standard);
  let total = 0, validCount = 0;
  for (let i = 0; i < 21; i++) {
    const u = normUser[i], s = normStandard[i];
    if (!u || !s) continue;
    const dx = u.x - s.x, dy = u.y - s.y;
    total += Math.sqrt(dx * dx + dy * dy);
    validCount++;
  }
  return validCount > 0 ? total / validCount : 1.0;
}

function updateFeedback(score, final = false, matchedFrames = []) {
  const feedback = document.getElementById("feedback");
  const avgMatchedScore = matchedFrames.length > 0
    ? matchedFrames.reduce((a, b) => a + (1 - b), 0) / matchedFrames.length
    : (1 - score);

  if (avgMatchedScore > 0.8) {
    feedback.textContent = `🎯 匹配优秀（得分 ${avgMatchedScore.toFixed(2)}）`;
    feedback.className = "text-green-700 bg-green-100 ...";
  } else if (avgMatchedScore > 0.6) {
    feedback.textContent = `🙂 大致相似（得分 ${avgMatchedScore.toFixed(2)}）`;
    feedback.className = "text-yellow-700 bg-yellow-100 ...";
  } else {
    feedback.textContent = final
      ? `⚠️ 动作不匹配（平均得分 ${avgMatchedScore.toFixed(2)}）`
      : `继续分析中...`;
    feedback.className = "text-gray-700 bg-gray-100 ...";
  }
}

function drawAbsoluteLandmarks(ctx, landmarks, width, height) {
  if (!landmarks) return;
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [0, 9], [9, 10], [10, 11], [11, 12],
    [0, 13], [13, 14], [14, 15], [15, 16],
    [0, 17], [17, 18], [18, 19], [19, 20],
  ];
  const points = landmarks.map(p => ({ x: p.x * width, y: p.y * height }));

  ctx.strokeStyle = "#f43f5e";
  ctx.lineWidth = 2;
  connections.forEach(([s, e]) => {
    ctx.beginPath();
    ctx.moveTo(points[s].x, points[s].y);
    ctx.lineTo(points[e].x, points[e].y);
    ctx.stroke();
  });

  ctx.fillStyle = "#f43f5e";
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function displayBestMatches(matches) {
  const container = document.getElementById("topFramesContainer");
  container.innerHTML = "";
  if (!matches.length) return;
  matches.forEach(({ imageData, landmarks }) => {
    const card = document.createElement("canvas");
    card.width = 320;
    card.height = 240;
    card.className = "rounded shadow";
    const context = card.getContext("2d");
    const img = new Image();
    img.onload = () => {
      context.drawImage(img, 0, 0, 320, 240);
      drawAbsoluteLandmarks(context, landmarks, 320, 240);
    };
    img.src = imageData;
    container.appendChild(card);
  });
}

async function analyzeVideo(video) {
  const interval = 200;
  const duration = video.duration * 1000;
  const frameResults = [];
  for (let t = 0; t < duration; t += interval) {
    video.currentTime = t / 1000;
    await new Promise((res) => (video.onseeked = res));
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const bitmap = await createImageBitmap(canvas);
    const result = await handLandmarker.detect(bitmap);
    if (result.landmarks.length > 0) {
      frameResults.push({
        time: t,
        landmarks: result.landmarks[0],
        imageData: canvas.toDataURL(),
      });
    }
  }

  frameScores = frameResults.map(() => 1.0);
  const topFrames = [];
  const matchedFrameScores = [];

  standardLandmarks.forEach((standard, idx) => {
    let best = { score: Infinity, index: -1 };
    frameResults.forEach((frame, i) => {
      const score = computeScore(frame.landmarks, standard);
      if (score < best.score) {
        best = { score, index: i };
      }
      frameScores[i] = Math.min(frameScores[i], score);
    });
    if (best.index >= 0) {
      topFrames.push(frameResults[best.index]);
      matchedFrameScores.push(best.score);
    }
  });

  const matchRatio = frameScores.filter(s => 1 - s >= 0.75).length / frameScores.length;
  const showMatch = matchRatio > 0;

  const container = document.getElementById("topFramesContainer");
  container.style.display = showMatch ? "flex" : "none";
  if (!showMatch) {
    document.getElementById("feedback").textContent = "❌ 未识别出有效手势，请重新尝试。";
    container.innerHTML = "";
    return;
  }

  updateFeedback(0, true, matchedFrameScores);
  displayBestMatches(topFrames);
}

document.getElementById("videoUpload").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  const video = document.getElementById("uploadedVideo");
  video.src = URL.createObjectURL(file);
  video.onloadedmetadata = async () => {
    matched = false;
    frameScores = [];
    canvas = document.getElementById("hiddenCanvas");
    ctx = canvas.getContext("2d");
    console.log("📽️ 视频元信息已加载，开始处理");
    await analyzeVideo(video);
  };
});

async function setup() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "/static/models/hand_landmarker.task",
    },
    runningMode: "IMAGE",
    numHands: 1,
  });

  const initWord = document.getElementById("gestureSelect").value;
  const res = await fetch(`/static/data/${initWord}.json`);
  standardLandmarks = await res.json();

  const standardVideo = document.getElementById("standardVideo");
  if (standardVideo) {
    standardVideo.src = `/static/videos/${initWord}.mp4`;
    standardVideo.style.maxWidth = "100%";
    standardVideo.style.height = "auto";
  }

  playStandardFrames(standardLandmarks);
  console.log("✅ 模型和标准姿势加载完毕");
}

setup();






// 选择框

const cardVideo = document.getElementById("card-video");
const cardLive = document.getElementById("card-live");
const uploadSection = document.getElementById("uploadSection");
const liveSection = document.getElementById("liveSection");

// 初始状态
setActiveMode("video");

// 切换处理
cardVideo.addEventListener("click", () => setActiveMode("video"));
cardLive.addEventListener("click", () => setActiveMode("live"));

function setActiveMode(mode) {
  if (mode === "video") {
    uploadSection.style.display = "block";
    liveSection.style.display = "none";
    cardVideo.classList.add("ring-2", "ring-blue-500", "bg-blue-50");
    cardLive.classList.remove("ring-2", "ring-blue-500", "bg-blue-50");
  } else {
    uploadSection.style.display = "none";
    liveSection.style.display = "block";
    cardLive.classList.add("ring-2", "ring-blue-500", "bg-blue-50");
    cardVideo.classList.remove("ring-2", "ring-blue-500", "bg-blue-50");
  }
}














let liveStream = null;
let liveTimer = null;
const liveCanvas = document.createElement("canvas");
const liveCtx = liveCanvas.getContext("2d");

async function startLiveCamera() {
  const video = document.getElementById("liveVideo");
  video.style.transform = "scaleX(-1)";

  try {
    liveStream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = liveStream;
    video.onloadedmetadata = () => {
      video.play();
      liveCanvas.width = video.videoWidth;
      liveCanvas.height = video.videoHeight;
    };
    document.getElementById("startLiveBtn").classList.add("hidden");
    document.getElementById("stopLiveBtn").classList.remove("hidden");
    liveLoop();
  } catch (err) {
    alert("🚫 无法访问摄像头: " + err.message);
  }
}

function stopLiveCamera() {
  if (liveStream) {
    liveStream.getTracks().forEach(track => track.stop());
    liveStream = null;
  }
  cancelAnimationFrame(liveTimer);
  document.getElementById("startLiveBtn").classList.remove("hidden");
  document.getElementById("stopLiveBtn").classList.add("hidden");
  document.getElementById("liveFeedback").textContent = "已停止实时检测。";
}

function mirrorLandmarksX(landmarks) {
  return landmarks.map(p => ({
    x: 1 - p.x,
    y: p.y
  }));
}

async function liveLoop() {
  const video = document.getElementById("liveVideo");
  liveCtx.drawImage(video, 0, 0, liveCanvas.width, liveCanvas.height);
  const bitmap = await createImageBitmap(liveCanvas);
  const result = await handLandmarker.detect(bitmap);

  if (result.landmarks.length > 0) {
    const mirroredLandmarks = mirrorLandmarksX(result.landmarks[0]);
    let bestScore = Infinity;
    for (const standard of standardLandmarks) {
      const score = computeScore(mirroredLandmarks, standard);
      bestScore = Math.min(bestScore, score);
    }
    const finalScore = 1 - bestScore;
    const label = finalScore > 0.8 ? "🎯 匹配优秀"
                : finalScore > 0.6 ? "🙂 大致相似"
                : "⚠️ 动作不匹配";
    document.getElementById("liveFeedback").textContent = `${label}（得分 ${finalScore.toFixed(2)}）`;
  } else {
    document.getElementById("liveFeedback").textContent = "未检测到手部。";
  }

  liveTimer = requestAnimationFrame(liveLoop);
}

// === 绑定按钮 === //
document.getElementById("startLiveBtn").addEventListener("click", startLiveCamera);
document.getElementById("stopLiveBtn").addEventListener("click", stopLiveCamera);
