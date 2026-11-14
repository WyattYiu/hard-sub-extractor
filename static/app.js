(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const el = {
    landing: $("#landing"),
    workspace: $("#workspace"),
    syncView: $("#syncView"),
    tabExtract: $("#tabExtract"),
    tabSync: $("#tabSync"),
    tabMux: $("#tabMux"),
    tabCut: $("#tabCut"),
    tabTranslate: $("#tabTranslate"),
    translateView: $("#translateView"),
    translateFileInput: $("#translateFileInput"),
    translateDrop: $("#translateDrop"),
    translateFileName: $("#translateFileName"),
    translateSource: $("#translateSource"),
    translateTarget: $("#translateTarget"),
    translateBilingual: $("#translateBilingual"),
    translateStartBtn: $("#translateStartBtn"),
    translateProgress: $("#translateProgress"),
    translateProgressLabel: $("#translateProgressLabel"),
    translateProgressPct: $("#translateProgressPct"),
    translateProgressBar: $("#translateProgressBar"),
    translateStatus: $("#translateStatus"),
    translatePreview: $("#translatePreview"),
    translatePreviewCount: $("#translatePreviewCount"),
    translateOutputFormat: $("#translateOutputFormat"),
    translateDownload: $("#translateDownload"),
    translateTaskList: $("#translateTaskList"),
    translateNewTask: $("#translateNewTask"),
    translateSelectAll: $("#translateSelectAll"),
    translateDeleteSelected: $("#translateDeleteSelected"),
    translateRunSelected: $("#translateRunSelected"),
    cutView: $("#cutView"),
    cutVideo: $("#cutVideo"),
    cutPlayBtn: $("#cutPlayBtn"),
    cutTimeline: $("#cutTimeline"),
    cutTimeLabel: $("#cutTimeLabel"),
    cutEmpty: $("#cutEmpty"),
    cutVideoInput: $("#cutVideoInput"),
    cutVideoName: $("#cutVideoName"),
    cutStart: $("#cutStart"),
    cutEnd: $("#cutEnd"),
    cutStartNow: $("#cutStartNow"),
    cutEndNow: $("#cutEndNow"),
    cutReset: $("#cutReset"),
    cutSummary: $("#cutSummary"),
    cutMode: $("#cutMode"),
    cutModeNote: $("#cutModeNote"),
    cutStartBtn: $("#cutStartBtn"),
    cutStatus: $("#cutStatus"),
    cutProgress: $("#cutProgress"),
    cutProgressLabel: $("#cutProgressLabel"),
    cutProgressPct: $("#cutProgressPct"),
    cutProgressBar: $("#cutProgressBar"),
    cutDownload: $("#cutDownload"),
    cutTaskList: $("#cutTaskList"),
    cutNewTask: $("#cutNewTask"),
    cutSelectAll: $("#cutSelectAll"),
    cutDeleteSelected: $("#cutDeleteSelected"),
    cutRunSelected: $("#cutRunSelected"),
    muxView: $("#muxView"),
    muxVideo: $("#muxVideo"),
    muxPlayBtn: $("#muxPlayBtn"),
    muxTimeline: $("#muxTimeline"),
    muxTimeLabel: $("#muxTimeLabel"),
    muxOverlay: $("#muxOverlay"),
    muxEmpty: $("#muxEmpty"),
    muxVideoInput: $("#muxVideoInput"),
    muxSubInput: $("#muxSubInput"),
    muxVideoName: $("#muxVideoName"),
    muxSubName: $("#muxSubName"),
    muxTrackSummary: $("#muxTrackSummary"),
    muxLanguage: $("#muxLanguage"),
    muxTitle: $("#muxTitle"),
    muxOffset: $("#muxOffset"),
    muxOutputName: $("#muxOutputName"),
    muxDefault: $("#muxDefault"),
    muxStartBtn: $("#muxStartBtn"),
    muxStatus: $("#muxStatus"),
    muxProgress: $("#muxProgress"),
    muxProgressLabel: $("#muxProgressLabel"),
    muxProgressPct: $("#muxProgressPct"),
    muxProgressBar: $("#muxProgressBar"),
    muxDownload: $("#muxDownload"),
    muxTaskList: $("#muxTaskList"),
    muxNewTask: $("#muxNewTask"),
    muxSelectAll: $("#muxSelectAll"),
    muxDeleteSelected: $("#muxDeleteSelected"),
    muxRunSelected: $("#muxRunSelected"),
    syncTaskList: $("#syncTaskList"),
    syncNewTask: $("#syncNewTask"),
    syncSelectAll: $("#syncSelectAll"),
    syncDeleteSelected: $("#syncDeleteSelected"),
    syncRunSelected: $("#syncRunSelected"),
    syncVideo: $("#syncVideo"),
    syncPlayBtn: $("#syncPlayBtn"),
    syncTimeline: $("#syncTimeline"),
    syncTimeLabel: $("#syncTimeLabel"),
    syncStage: $("#syncStage"),
    syncOverlay: $("#syncOverlay"),
    syncEmpty: $("#syncEmpty"),
    syncVideoInput: $("#syncVideoInput"),
    syncVideoName: $("#syncVideoName"),
    syncSubInput: $("#syncSubInput"),
    syncSubName: $("#syncSubName"),
    syncCompatBtn: $("#syncCompatBtn"),
    syncCueList: $("#syncCueList"),
    syncCueCount: $("#syncCueCount"),
    syncSourceJob: $("#syncSourceJob"),
    syncAutoBtn: $("#syncAutoBtn"),
    syncAutoStatus: $("#syncAutoStatus"),
    syncAutoResult: $("#syncAutoResult"),
    syncAutoMetrics: $("#syncAutoMetrics"),
    syncApplyAuto: $("#syncApplyAuto"),
    syncClearAuto: $("#syncClearAuto"),
    syncOffset: $("#syncOffset"),
    syncOffsetNote: $("#syncOffsetNote"),
    syncSummary: $("#syncSummary"),
    syncAddAnchor: $("#syncAddAnchor"),
    syncAddEnd: $("#syncAddEnd"),
    syncClearAnchors: $("#syncClearAnchors"),
    syncAnchorList: $("#syncAnchorList"),
    syncExportSrt: $("#syncExportSrt"),
    syncExportAss: $("#syncExportAss"),
    dropzone: $("#dropzone"),
    fileInput: $("#fileInput"),
    uploadProgress: $("#uploadProgress"),
    uploadBar: $("#uploadBar"),
    uploadPct: $("#uploadPct"),
    uploadLabel: $("#uploadLabel"),
    recentSection: $("#recentSection"),
    recentGrid: $("#recentGrid"),
    backBtn: $("#backBtn"),
    deleteBtn: $("#deleteBtn"),
    extractTaskList: $("#extractTaskList"),
    extractResultsTab: $("#extractResultsTab"),
    extractSettingsTab: $("#extractSettingsTab"),
    extractResultsPane: $("#extractResultsPane"),
    extractSettingsPane: $("#extractSettingsPane"),
    extractNewTask: $("#extractNewTask"),
    extractSelectAll: $("#extractSelectAll"),
    extractRunSelected: $("#extractRunSelected"),
    extractDeleteSelected: $("#extractDeleteSelected"),
    saveSettingsBtn: $("#saveSettingsBtn"),
    jobName: $("#jobName"),
    jobMeta: $("#jobMeta"),
    video: $("#video"),
    videoStage: $("#videoStage"),
    stageEmpty: $("#stageEmpty"),
    extractUploadBtn: $("#extractUploadBtn"),
    stageUploadStatus: $("#stageUploadStatus"),
    roi: $("#roi"),
    captionOverlay: $("#captionOverlay"),
    playBtn: $("#playBtn"),
    timeline: $("#timeline"),
    timeLabel: $("#timeLabel"),
    overlayToggle: $("#overlayToggle"),
    volumeBtn: $("#volumeBtn"),
    volumeSlider: $("#volumeSlider"),
    volumeValue: $("#volumeValue"),
    autoRegion: $("#autoRegion"),
    liveCaption: $("#liveCaption"),
    liveTime: $("#liveTime"),
    resultsCard: $("#resultsCard"),
    resultCount: $("#resultCount"),
    resultStats: $("#resultStats"),
    cueBody: $("#cueBody"),
    tableCount: $("#tableCount"),
    visibleCount: $("#visibleCount"),
    confidenceFilter: $("#confidenceFilter"),
    searchInput: $("#searchInput"),
    saveBtn: $("#saveBtn"),
    saveState: $("#saveState"),
    downloadSrt: $("#downloadSrt"),
    downloadAss: $("#downloadAss"),
    languageChips: $("#languageChips"),
    languageNote: $("#languageNote"),
    conversionSel: $("#conversionSel"),
    precisionGrid: $("#precisionGrid"),
    precisionHint: $("#precisionHint"),
    minDuration: $("#minDuration"),
    confidence: $("#confidence"),
    confidenceValue: $("#confidenceValue"),
    minTextHeight: $("#minTextHeight"),
    minTextGuide: $("#minTextGuide"),
    minTextGuideHandle: $("#minTextGuideHandle"),
    minTextGuideLabel: $("#minTextGuideLabel"),
    minTextGuideBtn: $("#minTextGuideBtn"),
    fontName: $("#fontName"),
    fontSize: $("#fontSize"),
    borderWidth: $("#borderWidth"),
    sceneFilter: $("#sceneFilter"),
    roiSummary: $("#roiSummary"),
    roiMiniPoster: $("#roiMiniPoster"),
    roiMiniBox: $("#roiMiniBox"),
    roiMeta: $("#roiMeta"),
    roiLocate: $("#roiLocate"),
    roiX: $("#roiX"),
    roiY: $("#roiY"),
    roiW: $("#roiW"),
    roiH: $("#roiH"),
    roiApply: $("#roiApply"),
    roiHistoryToggle: $("#roiHistoryToggle"),
    roiHistoryCount: $("#roiHistoryCount"),
    roiHistoryList: $("#roiHistoryList"),
    extractionStart: $("#extractionStart"),
    extractionEnd: $("#extractionEnd"),
    rangeReset: $("#rangeReset"),
    rangeStartNow: $("#rangeStartNow"),
    rangeEndNow: $("#rangeEndNow"),
    rangeHint: $("#rangeHint"),
    selectAllRows: $("#selectAllRows"),
    selectAllInline: $("#selectAllInline"),
    selectedCount: $("#selectedCount"),
    mergeBtn: $("#mergeBtn"),
    deleteSelectedBtn: $("#deleteSelectedBtn"),
    cleanLangBtn: $("#cleanLangBtn"),
    dedupeBtn: $("#dedupeBtn"),
    undoBtn: $("#undoBtn"),
    redoBtn: $("#redoBtn"),
    offsetInput: $("#offsetInput"),
    offsetBtn: $("#offsetBtn"),
    startBtn: $("#startBtn"),
    startHint: $("#startHint"),
    settingsPanel: $("#settingsPanel"),
    progressCard: $("#progressCard"),
    progressTitle: $("#progressTitle"),
    progressPct: $("#progressPct"),
    progressBar: $("#progressBar"),
    progressMessage: $("#progressMessage"),
    stageList: $("#stageList"),
    partialPreview: $("#partialPreview"),
    partialCount: $("#partialCount"),
    partialList: $("#partialList"),
    logBox: $("#logBox"),
    logToggle: $("#logToggle"),
    cancelBtn: $("#cancelBtn"),
    tipCard: $("#tipCard"),
    helpBtn: $("#helpBtn"),
    helpModal: $("#helpModal"),
    mergeModal: $("#mergeModal"),
    cleanupModal: $("#cleanupModal"),
    cleanupEyebrow: $("#cleanupEyebrow"),
    cleanupTitle: $("#cleanupTitle"),
    cleanupIntro: $("#cleanupIntro"),
    cleanupSummary: $("#cleanupSummary"),
    cleanupSelectAll: $("#cleanupSelectAll"),
    cleanupSelectedCount: $("#cleanupSelectedCount"),
    cleanupList: $("#cleanupList"),
    cleanupCancel: $("#cleanupCancel"),
    cleanupConfirm: $("#cleanupConfirm"),
    mergeTitle: $("#mergeTitle"),
    mergeIntro: $("#mergeIntro"),
    mergeCueList: $("#mergeCueList"),
    mergeFinalText: $("#mergeFinalText"),
    mergeRange: $("#mergeRange"),
    mergeReset: $("#mergeReset"),
    mergeConfirm: $("#mergeConfirm"),
    mergeCancel: $("#mergeCancel"),
    toastWrap: $("#toastWrap"),
  };

  const syncState = {
    videoUrl: null,
    videoName: "",
    subtitleName: "",
    cues: [],
    offset: 0,
    anchors: [],
    selectedId: null,
    videoFile: null,
    compatUrl: null,
    auto: null,
    pendingAuto: null,
    taskId: "sync-1",
  };
  const syncTasks = [];
  const selectedSyncTasks = new Set();
  let syncTaskSeq = 1;

  const muxState = {
    videoFile: null,
    subtitleFile: null,
    cues: [],
    objectUrl: null,
    outputUrl: null,
    pollTimer: null,
    pollToken: null,
    titleAuto: true,
    outputNameAuto: true,
    draftId: null,
  };
  const translateDrafts = [];
  const selectedTranslateTasks = new Set();
  let translateDraftSeq = 0;
  let translateBatchBusy = false;
  const muxDrafts = [];
  const selectedMuxTasks = new Set();
  let muxDraftSeq = 0;
  let muxBatchBusy = false;

  const cutState = {
    videoFile: null,
    objectUrl: null,
    duration: 0,
    pollTimer: null,
    pollToken: null,
    outputUrl: null,
    draftId: null,
  };
  const cutDrafts = [];
  const selectedCutTasks = new Set();
  let cutDraftSeq = 0;
  let cutBatchBusy = false;

  const state = {
    job: null,
    cues: [],
    filter: "",
    minConfidence: 0,
    maxConfidence: 1,
    roi: { x: 0.03, y: 0.52, w: 0.94, h: 0.45 },
    duration: 0,
    videoUrl: null,
    selected: new Set(),
    selectionAnchor: null,
    pageCueIds: [],
    partialCues: [],
    undoStack: [],
    redoStack: [],
    pendingMergeIds: null,
    cleanupPlan: null,
    textEditActive: false,
    textEditCueId: null,
    textEditTimer: null,
    dirty: false,
    saving: false,
    saveTimer: null,
    es: null,
    pollTimer: null,
    finalizing: false,
    finished: false,
    overlay: false,
    lastVolume: 1,
    processing: false,
    dragging: null,
    activeCueId: null,
    minGuideVisible: false,
    translateFile: null,
    translateTimer: null,
    translateToken: null,
    selectedExtractTasks: new Set(),
    translateDraftId: null,
    health: null,
  };

  const STATUS_LABEL = {
    ready: "待识别",
    processing: "识别中",
    done: "已完成",
    error: "失败",
    cancelled: "已取消",
  };

  const STAGE_ORDER = ["starting", "ocr", "build", "done"];

  // ---------------------------------------------------------------- utils
  function fmtClock(seconds, forceHours = false) {
    seconds = Math.max(0, Number(seconds) || 0);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0 || forceHours) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function fmtCueTime(seconds) {
    seconds = Math.max(0, Number(seconds) || 0);
    const total = Math.round(seconds * 1000);
    const h = Math.floor(total / 3600000);
    const m = Math.floor((total % 3600000) / 60000);
    const s = Math.floor((total % 60000) / 1000);
    const ms = total % 1000;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
  }

  function parseCueTime(value) {
    const text = String(value || "").trim().replace(",", ".");
    if (!text) return null;
    const parts = text.split(":");
    if (parts.length > 3) return null;
    const nums = parts.map((part) => Number(part));
    if (nums.some((n) => !Number.isFinite(n) || n < 0)) return null;
    if (nums.length === 3) return nums[0] * 3600 + nums[1] * 60 + nums[2];
    if (nums.length === 2) return nums[0] * 60 + nums[1];
    return nums[0];
  }

  function fmtDuration(seconds) {
    seconds = Math.max(0, Number(seconds) || 0);
    if (seconds >= 3600) {
      const h = Math.floor(seconds / 3600);
      const m = Math.round((seconds % 3600) / 60);
      return `${h} 小时 ${m} 分`;
    }
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return m ? `${m} 分 ${s} 秒` : `${s} 秒`;
  }

  function fmtBytes(bytes) {
    bytes = Number(bytes) || 0;
    if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
    if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${bytes} B`;
  }

  function clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
  }

  function toast(message, type = "") {
    const node = document.createElement("div");
    node.className = `toast ${type}`.trim();
    node.textContent = message;
    el.toastWrap.appendChild(node);
    setTimeout(() => {
      node.style.opacity = "0";
      node.style.transform = "translateY(6px)";
      node.style.transition = "opacity .2s, transform .2s";
      setTimeout(() => node.remove(), 220);
    }, 3400);
  }

  async function api(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    let response;
    try {
      response = await fetch(url, {
        headers: options.body ? { "Content-Type": "application/json" } : undefined,
        signal: controller.signal,
        ...options,
      });
    } finally {
      clearTimeout(timer);
    }
    let data = null;
    try { data = await response.json(); } catch (_) { data = null; }
    if (!response.ok) {
      const message = (data && data.error) || `请求失败（${response.status}）`;
      throw new Error(message);
    }
    return data;
  }

  // ---------------------------------------------------------------- health / recent
  async function checkHealth() {
    try {
      state.health = await api("/api/health");
      if (!state.health.vision) {
        el.startHint.textContent = "未找到 Vision OCR 组件，请先在终端运行 ./setup.sh。";
        el.startHint.style.color = "#b93d1c";
      } else if (!state.health.ffmpeg) {
        el.startHint.textContent = "未找到 ffmpeg，请先安装后再开始识别。";
        el.startHint.style.color = "#b93d1c";
      }
    } catch (_) { /* health is advisory */ }
  }

  async function loadRecent() {
    try {
      const data = await api("/api/jobs");
      const jobs = (data && data.jobs) || [];
      el.recentSection.hidden = jobs.length === 0;
      el.recentGrid.replaceChildren();
      jobs.slice(0, 8).forEach((job) => {
        const item = document.createElement("div");
        item.className = "recent-item";

        const card = document.createElement("button");
        card.type = "button";
        card.className = "recent-card";
        card.addEventListener("click", () => openJob(job.id));

        const thumb = document.createElement("div");
        thumb.className = "recent-thumb";
        if (job.poster) {
          const img = document.createElement("img");
          img.src = `/api/jobs/${job.id}/poster`;
          img.alt = "";
          img.loading = "lazy";
          thumb.appendChild(img);
        } else {
          const fallback = document.createElement("span");
          fallback.className = "fallback";
          fallback.textContent = "字幕匠";
          thumb.appendChild(fallback);
        }
        const badge = document.createElement("span");
        badge.className = "recent-status";
        badge.textContent = STATUS_LABEL[job.status] || job.status;
        thumb.appendChild(badge);

        const info = document.createElement("div");
        info.className = "recent-info";
        const name = document.createElement("b");
        name.textContent = job.name || "未命名影片";
        const meta = document.createElement("small");
        const pieces = [];
        if (job.probe && job.probe.duration) pieces.push(fmtClock(job.probe.duration, job.probe.duration >= 3600));
        if (job.cue_count) pieces.push(`${job.cue_count} 条字幕`);
        if (job.probe && job.probe.display_width) pieces.push(`${job.probe.display_width}×${job.probe.display_height}`);
        meta.textContent = pieces.join(" · ") || "等待处理";
        info.append(name, meta);
        card.append(thumb, info);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "recent-delete";
        remove.title = job.status === "processing" ? "任务运行中，请先取消" : "删除这个任务";
        remove.setAttribute("aria-label", `删除 ${job.name || "任务"}`);
        remove.innerHTML = '<svg viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M6.2 4.5V3h3.6v1.5M5 4.5l.5 8h5l.5-8M6.8 7v3.5M9.2 7v3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        remove.disabled = job.status === "processing";
        remove.addEventListener("click", (event) => {
          event.stopPropagation();
          deleteRecentJob(job);
        });

        item.append(card, remove);
        el.recentGrid.appendChild(item);
      });
    } catch (_) {
      el.recentSection.hidden = true;
    }
  }

  async function deleteRecentJob(job) {
    if (!job || job.status === "processing") {
      toast("任务正在运行，请先打开任务并取消", "error");
      return;
    }
    const name = job.name || "这个任务";
    if (!window.confirm(`删除「${name}」以及本地视频和字幕缓存？此操作不可撤销。`)) return;
    try {
      await api(`/api/jobs/${job.id}`, { method: "DELETE" });
      if (localStorage.getItem("hardsub.lastJob") === job.id) {
        localStorage.removeItem("hardsub.lastJob");
      }
      toast("任务已删除", "success");
      await loadRecent();
    } catch (error) {
      toast(error.message || "删除任务失败", "error");
    }
  }

  // ---------------------------------------------------------------- upload
  function initUpload() {
    el.dropzone.addEventListener("click", () => el.fileInput.click());
    el.dropzone.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        el.fileInput.click();
      }
    });
    el.fileInput.addEventListener("change", () => {
      if (el.fileInput.files && el.fileInput.files[0]) uploadFile(el.fileInput.files[0]);
    });
    el.stageEmpty.addEventListener("click", (event) => {
      if (event.target.closest("#extractUploadBtn")) el.fileInput.click();
    });
    ["dragenter", "dragover"].forEach((name) => {
      el.dropzone.addEventListener(name, (event) => {
        event.preventDefault();
        el.dropzone.classList.add("is-dragover");
      });
    });
    ["dragleave", "drop"].forEach((name) => {
      el.dropzone.addEventListener(name, (event) => {
        event.preventDefault();
        el.dropzone.classList.remove("is-dragover");
      });
    });
    el.dropzone.addEventListener("drop", (event) => {
      const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
      if (file) uploadFile(file);
    });
  }

  function isVideoFile(file) {
    if (!file) return false;
    if ((file.type || "").startsWith("video/")) return true;
    return /\.(mp4|mkv|mov|avi|webm|m4v|ts|flv|wmv|mpg|mpeg)$/i.test(file.name || "");
  }

  function uploadFile(file) {
    if (!isVideoFile(file)) {
      toast("请选择视频文件（MP4 / MKV / MOV 等）", "error");
      return;
    }
    el.dropzone.hidden = true;
    el.uploadProgress.hidden = false;
    el.uploadBar.style.width = "0%";
    el.uploadPct.textContent = "0%";
    el.uploadLabel.textContent = "正在上传视频…";
    const stageStatus = $("#stageUploadStatus");
    if (stageStatus) {
      stageStatus.hidden = false;
      stageStatus.textContent = "正在上传 0%";
    }
    const stageBtn = $("#extractUploadBtn");
    if (stageBtn) {
      stageBtn.disabled = true;
      stageBtn.textContent = "正在上传…";
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/jobs");
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const pct = Math.round((event.loaded / event.total) * 100);
      el.uploadBar.style.width = `${pct}%`;
      el.uploadPct.textContent = `${pct}%`;
      const stageStatus = $("#stageUploadStatus");
      if (stageStatus) stageStatus.textContent = `正在上传 ${pct}%`;
      if (pct >= 100) el.uploadLabel.textContent = "正在读取视频信息…";
    };
    xhr.onerror = () => {
      toast("上传失败，请检查文件后重试", "error");
      resetUpload();
    };
    xhr.onload = () => {
      let data = null;
      try { data = JSON.parse(xhr.responseText); } catch (_) { data = null; }
      if (xhr.status === 201 && data && data.id) {
        resetUpload();
        openJob(data.id);
      } else {
        toast((data && data.error) || "上传失败", "error");
        resetUpload();
      }
    };
    const form = new FormData();
    form.append("video", file, file.name);
    xhr.send(form);
  }

  function resetUpload() {
    el.fileInput.value = "";
    el.dropzone.hidden = false;
    el.uploadProgress.hidden = true;
    const stageStatus = $("#stageUploadStatus");
    if (stageStatus) stageStatus.hidden = true;
    const stageBtn = $("#extractUploadBtn");
    if (stageBtn) {
      stageBtn.disabled = false;
      stageBtn.textContent = "选择视频";
    }
  }

  // ---------------------------------------------------------------- open / close jobs
  async function openJob(jobId) {
    closeEvents();
    el.syncView.hidden = true;
    el.muxView.hidden = true;
    el.cutView.hidden = true;
    el.translateView.hidden = true;
    el.syncVideo.pause();
    el.muxVideo.pause();
    el.cutVideo.pause();
    el.tabExtract.classList.add("is-active");
    el.tabSync.classList.remove("is-active");
    el.tabMux.classList.remove("is-active");
    el.tabCut.classList.remove("is-active");
    el.tabTranslate.classList.remove("is-active");
    try {
      const job = await api(`/api/jobs/${jobId}`);
      state.job = job;
      state.cues = Array.isArray(job.cues) ? job.cues : [];
      state.filter = "";
      state.minConfidence = 0;
      state.maxConfidence = 1;
      state.dirty = false;
      state.finished = false;
      localStorage.setItem("hardsub.lastJob", job.id);
      el.searchInput.value = "";
      el.confidenceFilter.value = "all";
      el.landing.hidden = true;
      el.landing.classList.remove("is-job-open");
      el.workspace.hidden = false;
      el.workspace.classList.remove("is-empty");
      el.deleteBtn.hidden = false;
      el.startBtn.disabled = false;
      applyJob(job);
      el.workspace.scrollIntoView({ behavior: "auto", block: "start" });
      if (job.status === "processing") {
        switchExtractPanel("settings");
        showProgress(job);
        connectEvents(job.id);
      } else if (job.status === "done") {
        el.progressCard.hidden = true;
        renderResults();
      } else if (job.status === "error" || job.status === "cancelled") {
        switchExtractPanel("settings");
        showProgress(job, true);
      }
      loadRecent();
      refreshExtractTasks();
    } catch (error) {
      localStorage.removeItem("hardsub.lastJob");
      toast(error.message || "无法打开任务", "error");
    }
  }

  function showLanding() {
    closeEvents();
    el.video.pause();
    el.syncVideo.pause();
    el.syncView.hidden = true;
    el.muxView.hidden = true;
    el.cutView.hidden = true;
    el.translateView.hidden = true;
    el.tabExtract.classList.add("is-active");
    el.tabSync.classList.remove("is-active");
    el.tabMux.classList.remove("is-active");
    el.tabCut.classList.remove("is-active");
    el.tabTranslate.classList.remove("is-active");
    el.workspace.hidden = false;
    el.workspace.classList.add("is-empty");
    el.landing.hidden = true;
    el.landing.classList.remove("is-job-open");
    el.jobName.textContent = "选择视频开始提取";
    el.jobMeta.replaceChildren();
    el.deleteBtn.hidden = true;
    el.startBtn.disabled = true;
    el.videoStage.classList.remove("is-ready");
    el.stageEmpty.innerHTML = `
      <div class="extract-empty-icon"><svg viewBox="0 0 32 32" fill="none"><rect x="3" y="6" width="26" height="20" rx="4" stroke="currentColor" stroke-width="1.6"/><path d="M3 21l7-6 5 4 4-4 10 8" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="21" cy="12" r="2.4" stroke="currentColor" stroke-width="1.6"/></svg></div>
      <b>选择视频开始提取</b>
      <span>拖入视频，或点击下方按钮</span>
      <button class="extract-upload-btn" id="extractUploadBtn" type="button">选择视频</button>
      <p class="stage-upload-status" id="stageUploadStatus" hidden></p>`;
    el.stageEmpty.hidden = false;
    el.extractUploadBtn = $("#extractUploadBtn");
    el.stageUploadStatus = $("#stageUploadStatus");
    el.video.removeAttribute("src");
    el.video.load();
    state.job = null;
    state.cues = [];
    state.partialCues = [];
    state.minGuideVisible = false;
    if (el.minTextGuide) el.minTextGuide.hidden = true;
    state.videoUrl = null;
    state.processing = false;
    state.duration = 0;
    applySettings({});
    setRoi({ x: 0.03, y: 0.52, w: 0.94, h: 0.45 });
    switchExtractPanel("settings");
    localStorage.removeItem("hardsub.lastJob");
    loadRecent();
    window.scrollTo({ top: 0 });
  }

  function applyJob(job) {
    el.jobName.textContent = job.name || "未命名影片";
    const probe = job.probe || {};
    const meta = [];
    if (probe.duration) meta.push(fmtClock(probe.duration, probe.duration >= 3600));
    if (probe.display_width && probe.display_height) meta.push(`${probe.display_width} × ${probe.display_height}`);
    if (probe.fps) meta.push(`${Number(probe.fps).toFixed(2)} fps`);
    if (probe.size) meta.push(fmtBytes(probe.size));
    el.jobMeta.replaceChildren();
    meta.forEach((text) => {
      const span = document.createElement("span");
      span.textContent = text;
      el.jobMeta.appendChild(span);
    });

    state.duration = Number(probe.duration) || 0;
    applySettings(job.settings || {});
    if (job.poster) {
      el.roiMiniPoster.src = `/api/jobs/${job.id}/poster`;
      el.roiMiniPoster.hidden = false;
    } else {
      el.roiMiniPoster.removeAttribute("src");
      el.roiMiniPoster.hidden = true;
    }
    setRoi(job.settings && job.settings.roi ? job.settings.roi : { x: 0.03, y: 0.52, w: 0.94, h: 0.45 });
    renderRoiHistory();
    state.overlay = el.overlayToggle.checked;

    el.videoStage.classList.remove("is-ready");
    el.stageEmpty.hidden = false;
    const pw = Number(probe.display_width) || 16;
    const ph = Number(probe.display_height) || 9;
    el.videoStage.style.aspectRatio = `${pw} / ${ph}`;
    state.videoUrl = `/api/jobs/${job.id}/video`;
    el.video.removeAttribute("src");
    el.video.poster = job.poster ? `/api/jobs/${job.id}/poster` : "";
    el.video.load();
    el.videoStage.classList.add("is-ready");
    el.stageEmpty.hidden = true;
    el.timeline.value = "0";
    el.timeline.max = String(state.duration || 100);
    el.timeLabel.textContent = `00:00 / ${fmtClock(state.duration, state.duration >= 3600)}`;
    el.liveCaption.textContent = "播放视频，这里会显示当前时间轴上的识别结果。";
    el.liveCaption.classList.add("empty");
    el.liveTime.textContent = "等待播放";

    el.resultsCard.hidden = true;
    clearPartialCues();
    el.progressCard.hidden = true;
    el.progressCard.classList.remove("is-error", "is-done");
    el.captionOverlay.hidden = true;
    el.cueBody.replaceChildren();
    state.activeCueId = null;
    state.selected.clear();
    state.selectionAnchor = null;
    state.undoStack = [];
    state.redoStack = [];
    state.pageCueIds = [];
    updateSelectionUI();

    setProcessing(job.status === "processing");
    if (job.status === "done") {
      el.startBtn.querySelector("span").textContent = "重新提取字幕";
      el.startHint.textContent = "修改文字后可保存并导出；重新提取会覆盖当前结果。";
    } else {
      el.startBtn.querySelector("span").textContent = "开始提取字幕";
      el.startHint.textContent = "标准模式适合大多数影片。字幕越清晰，识别越准确。";
    }
  }

  function setProcessing(processing) {
    state.processing = processing;
    el.startBtn.disabled = processing;
    el.startBtn.classList.toggle("is-processing", processing);
    el.autoRegion.disabled = processing;
    el.roi.classList.toggle("is-locked", processing);
    [el.conversionSel, el.minDuration, el.confidence, el.minTextHeight, el.fontName, el.fontSize, el.borderWidth, el.sceneFilter,
      el.extractionStart, el.extractionEnd, el.rangeReset, el.rangeStartNow, el.rangeEndNow,
      el.roiX, el.roiY, el.roiW, el.roiH, el.roiApply
    ].forEach((node) => {
      if (node) node.disabled = processing;
    });
    $$("input", el.languageChips).forEach((input) => {
      input.disabled = processing;
      const chip = input.closest(".lang-chip");
      if (chip) chip.classList.toggle("is-disabled", processing);
    });
    $$('input[name="precision"]', el.precisionGrid).forEach((input) => { input.disabled = processing; });
    $$(".mini-btn[data-preset]").forEach((button) => { button.disabled = processing; });
    if (el.minTextGuide) el.minTextGuide.classList.toggle("is-locked", processing);
    if (processing) el.startBtn.querySelector("span").textContent = "正在识别…";
  }

  const LEGACY_LANGUAGES = {
    auto: ["zh", "en"],
    hans: ["zh"],
    hant: ["zh"],
    zh: ["zh"],
    zh_en: ["zh", "en"],
    zh_ja: ["zh", "ja"],
    en: ["en"],
    ja: ["ja"],
  };

  function selectedLanguages() {
    return $$("input", el.languageChips)
      .filter((input) => input.checked)
      .map((input) => input.value);
  }

  function updateLanguageChips() {
    const inputs = $$("input", el.languageChips);
    let langs = inputs.filter((input) => input.checked).map((input) => input.value);
    if (!langs.length) {
      const fallback = inputs.find((input) => input.value === "zh") || inputs[0];
      if (fallback) fallback.checked = true;
      langs = fallback ? [fallback.value] : [];
    }
    inputs.forEach((input) => {
      const chip = input.closest(".lang-chip");
      if (chip) chip.classList.toggle("is-checked", input.checked);
    });
    const notes = {
      "zh": "只保留中文；日文假名和纯英文行会被忽略。",
      "zh,en": "保留中文和英文；日文假名会被忽略。",
      "zh,ja": "保留中文和日语；英文行会被忽略。",
      "ja": "只保留日语；中文和英文行会被忽略。",
      "en": "只保留英文；中文和日文行会被忽略。",
      "en,ja": "保留英文和日语；中文行会被忽略。",
    };
    const key = langs.slice(0, 2).join(",");
    el.languageNote.textContent = notes[key] || "只保留所选语种，最多同时选择两种。";
    updateCleanButton();
  }

  function foreignLineCount() {
    if (!state.cues.length) return 0;
    const languages = selectedLanguages();
    let count = 0;
    state.cues.forEach((cue) => {
      (cue.text || "").split("\n").forEach((line) => {
        if (line.trim() && !languageAllowed(line, languages)) count += 1;
      });
    });
    return count;
  }

  function updateCleanButton() {
    if (!el.cleanLangBtn) return;
    const count = foreignLineCount();
    el.cleanLangBtn.disabled = state.cues.length === 0;
    el.cleanLangBtn.textContent = count ? `清理语种 (${count})` : "清理语种";
    el.cleanLangBtn.classList.toggle("attention", count > 0);
    el.cleanLangBtn.title = count
      ? `现有结果中有 ${count} 行不是当前所选语种，点击清理`
      : "按当前选择的语种清理现有字幕";
  }

  function setLanguageSelection(settings) {
    let langs = settings.languages;
    if (!Array.isArray(langs) || !langs.length) {
      langs = LEGACY_LANGUAGES[settings.language] || ["zh"];
    }
    const allowed = ["zh", "en", "ja"];
    langs = [...new Set(langs.filter((lang) => allowed.includes(lang)))].slice(0, 2);
    if (!langs.length) langs = ["zh"];
    $$("input", el.languageChips).forEach((input) => {
      input.checked = langs.includes(input.value);
    });
    updateLanguageChips();
  }

  function initLanguageChips() {
    el.languageChips.addEventListener("change", (event) => {
      const input = event.target;
      if (!input.matches("input")) return;
      const checked = $$("input", el.languageChips).filter((node) => node.checked);
      if (!checked.length) {
        input.checked = true;
        toast("至少保留一种语言", "error");
      } else if (checked.length > 2) {
        input.checked = false;
        toast("最多同时选择两种语言", "error");
      }
      updateLanguageChips();
    });
  }

  function applySettings(settings) {
    setLanguageSelection(settings);
    el.conversionSel.value = settings.conversion || "none";
    const precision = (!settings.precision || settings.precision === "balanced") ? "fine" : settings.precision;
    $$('input[name="precision"]', el.precisionGrid).forEach((input) => {
      input.checked = input.value === precision;
    });
    updatePrecisionUI(precision);
    el.minDuration.value = settings.min_duration != null ? settings.min_duration : 0.3;
    el.confidence.value = settings.confidence != null ? settings.confidence : 0.15;
    el.confidenceValue.textContent = Number(el.confidence.value).toFixed(2);
    el.minTextHeight.value = String(settings.min_text_height_px != null ? settings.min_text_height_px : 14);
    state.minGuideVisible = false;
    if (el.minTextGuide) el.minTextGuide.hidden = true;
    if (el.minTextGuideBtn) el.minTextGuideBtn.classList.remove("is-active");
    // Older jobs stored the previous Songti default but no font_size. Treat
    // them as the new Kaiti default; jobs that explicitly saved font_size stay.
    const legacyFont = settings.font_name === "Songti SC";
    el.fontName.value = legacyFont ? "Kaiti SC" : (settings.font_name || "Kaiti SC");
    if (!el.fontName.value) el.fontName.value = "Kaiti SC";
    let fontSize = settings.font_size != null ? Number(settings.font_size) : 70;
    if (fontSize === 50) fontSize = 70; // old default
    el.fontSize.value = fontSize;
    el.borderWidth.value = settings.border_width != null ? settings.border_width : 2;
    updateAssDownloadLink();
    el.sceneFilter.checked = settings.scene_text_filter !== false;
    const totalDuration = state.duration || 0;
    let start = Number(settings.extraction_start ?? 0);
    let end = settings.extraction_end == null ? totalDuration : Number(settings.extraction_end);
    if (!Number.isFinite(start)) start = 0;
    if (!Number.isFinite(end)) end = totalDuration;
    start = clamp(start, 0, Math.max(0, totalDuration - 0.05));
    end = clamp(end, start + 0.1, totalDuration || end);
    if (!totalDuration) end = 0;
    el.extractionStart.value = fmtCueTime(start);
    el.extractionEnd.value = fmtCueTime(end);
    updateRangeHint();
  }

  function readSettings() {
    const totalDuration = state.duration || 0;
    let extractionStart = parseCueTime(el.extractionStart.value);
    let extractionEnd = parseCueTime(el.extractionEnd.value);
    if (extractionStart == null) extractionStart = 0;
    if (extractionEnd == null) extractionEnd = totalDuration;
    extractionStart = clamp(extractionStart, 0, Math.max(0, totalDuration - 0.05));
    extractionEnd = clamp(extractionEnd, 0, totalDuration || extractionEnd);
    return {
      roi: { ...state.roi },
      languages: selectedLanguages(),
      extraction_start: Math.round(extractionStart * 1000) / 1000,
      extraction_end: Math.round(extractionEnd * 1000) / 1000,
      conversion: el.conversionSel.value,
      precision: ($$('input[name="precision"]', el.precisionGrid).find((input) => input.checked) || {}).value || "balanced",
      min_duration: Number(el.minDuration.value) || 0.3,
      confidence: Number(el.confidence.value) || 0.15,
      min_text_height_px: Number(el.minTextHeight.value) || 14,
      scene_text_filter: el.sceneFilter.checked,
      font_name: el.fontName.value || "Kaiti SC",
      font_size: Number(el.fontSize.value) || 70,
      border_width: Number(el.borderWidth.value) || 2,
    };
  }

  function updateRangeHint() {
    const total = state.duration || 0;
    const start = parseCueTime(el.extractionStart.value);
    const end = parseCueTime(el.extractionEnd.value);
    el.rangeHint.classList.remove("is-error");
    if (start == null || end == null) {
      el.rangeHint.textContent = "时间格式不正确";
      el.rangeHint.classList.add("is-error");
      return;
    }
    if (end <= start) {
      el.rangeHint.textContent = "结束要晚于开始";
      el.rangeHint.classList.add("is-error");
      return;
    }
    if (total && end > total + 0.05) {
      el.rangeHint.textContent = "超出视频长度";
      el.rangeHint.classList.add("is-error");
      return;
    }
    const isFull = start <= 0.05 && (!total || end >= total - 0.05);
    el.rangeHint.textContent = isFull
      ? `整段视频 · ${fmtDuration(total)}`
      : `${fmtClock(start)} – ${fmtClock(end)} · ${fmtDuration(end - start)}`;
  }

  async function setRangeFromPlayhead(which) {
    await ensureVideoLoaded();
    if (!el.video.src || !Number.isFinite(el.video.duration)) {
      toast("请先载入视频再取当前时间", "error");
      return;
    }
    const total = state.duration || el.video.duration;
    const now = clamp(el.video.currentTime || 0, 0, total);
    if (which === "start") {
      el.extractionStart.value = fmtCueTime(now);
      const end = parseCueTime(el.extractionEnd.value);
      if (end == null || end <= now + 0.1) {
        el.extractionEnd.value = fmtCueTime(Math.min(total, now + 1));
      }
    } else {
      el.extractionEnd.value = fmtCueTime(now);
      const start = parseCueTime(el.extractionStart.value);
      if (start == null || start >= now - 0.1) {
        el.extractionStart.value = fmtCueTime(Math.max(0, now - 1));
      }
    }
    updateRangeHint();
  }

  function updatePrecisionUI(precision) {
    $$(".precision-option", el.precisionGrid).forEach((label) => {
      const input = $('input[name="precision"]', label);
      label.classList.toggle("is-checked", input.checked);
    });
    const hints = { fast: "更快", balanced: "标准", fine: "推荐" };
    el.precisionHint.textContent = hints[precision] || "推荐";
    const descriptions = {
      fast: "快速模式：约 1.5 帧/秒，适合对速度要求高的影片。",
      balanced: "标准模式：约 2 帧/秒，速度与时间轴精度的平衡。",
      fine: "精细模式：约 4 帧/秒，时间轴更准确，处理时间更长。",
    };
    el.startHint.textContent = descriptions[precision] || descriptions.fine;
  }

  // ---------------------------------------------------------------- ROI
  const PRESETS = {
    bottom40: { x: 0.03, y: 0.52, w: 0.94, h: 0.45 },
    bottom30: { x: 0.03, y: 0.67, w: 0.94, h: 0.30 },
    full: { x: 0.005, y: 0.005, w: 0.99, h: 0.99 },
  };

  function normalizeRoi(roi) {
    const source = roi || {};
    let x = Number(source.x);
    let y = Number(source.y);
    let w = Number(source.w);
    let h = Number(source.h);
    if (!Number.isFinite(x)) x = 0.03;
    if (!Number.isFinite(y)) y = 0.6;
    if (!Number.isFinite(w)) w = 0.94;
    if (!Number.isFinite(h)) h = 0.45;
    x = clamp(x, 0, 0.98);
    y = clamp(y, 0, 0.98);
    w = clamp(w, 0.02, 1 - x);
    h = clamp(h, 0.02, 1 - y);
    return { x, y, w, h };
  }

  function setRoi(roi) {
    state.roi = normalizeRoi(roi);
    drawRoi();
    markPreset();
  }

  function updateMinTextGuide() {
    if (!el.minTextGuide) return;
    if (!state.job || !state.minGuideVisible) {
      el.minTextGuide.hidden = true;
      return;
    }
    const stageH = el.videoStage.clientHeight;
    const stageW = el.videoStage.clientWidth;
    const probe = state.job.probe || {};
    const videoH = Number(probe.display_height) || Number(probe.height) || 0;
    if (!stageH || !stageW || !videoH) {
      el.minTextGuide.hidden = true;
      return;
    }
    const px = clamp(Number(el.minTextHeight.value) || 14, 2, 300);
    const displayH = Math.max(3, stageH * px / videoH);
    const left = stageW * state.roi.x + 8;
    const bottom = stageH * (state.roi.y + state.roi.h);
    const top = Math.max(2, bottom - displayH - 8);
    el.minTextGuide.hidden = false;
    el.minTextGuide.style.left = `${left}px`;
    el.minTextGuide.style.top = `${top}px`;
    el.minTextGuide.style.height = `${displayH}px`;
    el.minTextGuideLabel.textContent = `${Math.round(px)} px`;
    el.minTextGuide.classList.toggle("label-left", left + 150 > stageW);
  }

  function toggleMinTextGuide() {
    if (!state.job) {
      toast("请先打开一个任务", "error");
      return;
    }
    state.minGuideVisible = !state.minGuideVisible;
    el.minTextGuideBtn.classList.toggle("is-active", state.minGuideVisible);
    updateMinTextGuide();
    if (state.minGuideVisible) {
      el.videoStage.scrollIntoView({ behavior: "smooth", block: "center" });
      toast("拖动画面中的高度标记，或用输入框填写像素高度", "success");
    }
  }

  function initMinTextGuideDrag() {
    if (!el.minTextGuideHandle) return;
    el.minTextGuideHandle.addEventListener("pointerdown", (event) => {
      if (state.processing || !state.job) return;
      event.preventDefault();
      event.stopPropagation();
      const stageH = el.videoStage.clientHeight;
      const videoH = Number((state.job.probe || {}).display_height) || Number((state.job.probe || {}).height) || 0;
      if (!stageH || !videoH) return;
      const startY = event.clientY;
      const startHeight = clamp(Number(el.minTextHeight.value) || 14, 2, 300);
      const scale = stageH / videoH;
      const move = (moveEvent) => {
        const px = clamp(startHeight + (startY - moveEvent.clientY) / scale, 2, 300);
        el.minTextHeight.value = String(Math.round(px));
        updateMinTextGuide();
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up, { once: true });
    });
  }

  function drawRoi() {
    const { x, y, w, h } = state.roi;
    el.roi.style.left = `${x * 100}%`;
    el.roi.style.top = `${y * 100}%`;
    el.roi.style.width = `${w * 100}%`;
    el.roi.style.height = `${h * 100}%`;
    const tag = $(".roi-tag", el.roi);
    if (tag) tag.textContent = `字幕区域 · ${Math.round(h * 100)}%`;
    updateRoiDisplay();
    updateMinTextGuide();
  }

  function markPreset() {
    $$(".mini-btn[data-preset]").forEach((button) => {
      const preset = PRESETS[button.dataset.preset];
      const same = preset && ["x", "y", "w", "h"].every((key) => Math.abs(preset[key] - state.roi[key]) < 0.012);
      button.classList.toggle("is-active", !!same);
    });
  }

  function sameRoi(a, b) {
    if (!a || !b) return false;
    return ["x", "y", "w", "h"].every((key) => Math.abs(Number(a[key]) - Number(b[key])) < 0.006);
  }

  function describeRoi(roi) {
    const height = Math.round(Number(roi.h) * 100);
    if (roi.w >= 0.98 && roi.h >= 0.98) return "全画面";
    if (Math.abs(roi.x - PRESETS.bottom40.x) < 0.015 && Math.abs(roi.y - PRESETS.bottom40.y) < 0.015
      && Math.abs(roi.w - PRESETS.bottom40.w) < 0.015) return "底部 45%";
    if (Math.abs(roi.x - PRESETS.bottom30.x) < 0.015 && Math.abs(roi.y - PRESETS.bottom30.y) < 0.015
      && Math.abs(roi.w - PRESETS.bottom30.w) < 0.015) return "底部 30%";
    if (roi.y >= 0.5) return `底部 ${height}%`;
    if (roi.y < 0.15) return `上方 ${height}%`;
    return `中部 ${height}%`;
  }

  function formatHistoryTime(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString("zh-CN", {
      month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
    });
  }

  function updateRoiDisplay() {
    const roi = state.roi;
    el.roiSummary.textContent = describeRoi(roi);
    el.roiMeta.textContent = `X ${(roi.x * 100).toFixed(1)}%  Y ${(roi.y * 100).toFixed(1)}%\n宽 ${(roi.w * 100).toFixed(1)}%  高 ${(roi.h * 100).toFixed(1)}%`;
    el.roiMiniBox.style.left = `${roi.x * 100}%`;
    el.roiMiniBox.style.top = `${roi.y * 100}%`;
    el.roiMiniBox.style.width = `${roi.w * 100}%`;
    el.roiMiniBox.style.height = `${roi.h * 100}%`;
    if (document.activeElement !== el.roiX) el.roiX.value = (roi.x * 100).toFixed(1);
    if (document.activeElement !== el.roiY) el.roiY.value = (roi.y * 100).toFixed(1);
    if (document.activeElement !== el.roiW) el.roiW.value = (roi.w * 100).toFixed(1);
    if (document.activeElement !== el.roiH) el.roiH.value = (roi.h * 100).toFixed(1);
  }

  function applyRoiInputs() {
    const x = Number(el.roiX.value);
    const y = Number(el.roiY.value);
    const w = Number(el.roiW.value);
    const h = Number(el.roiH.value);
    if (![x, y, w, h].every(Number.isFinite)) {
      toast("请输入有效的区域坐标", "error");
      updateRoiDisplay();
      return;
    }
    if (w < 2 || h < 2) {
      toast("字幕区域宽高至少为 2%", "error");
      updateRoiDisplay();
      return;
    }
    let x1 = clamp(x, 0, 98);
    let y1 = clamp(y, 0, 98);
    let w1 = clamp(w, 2, 100 - x1);
    let h1 = clamp(h, 2, 100 - y1);
    if (w1 < 2 || h1 < 2) {
      toast("区域超出画面范围，请调整 X / Y", "error");
      updateRoiDisplay();
      return;
    }
    setRoi({ x: x1 / 100, y: y1 / 100, w: w1 / 100, h: h1 / 100 });
    renderRoiHistory();
    el.videoStage.scrollIntoView({ behavior: "smooth", block: "center" });
    el.roi.classList.remove("is-flash");
    void el.roi.offsetWidth;
    el.roi.classList.add("is-flash");
    setTimeout(() => el.roi.classList.remove("is-flash"), 1000);
    toast("已应用自定义字幕区域", "success");
  }

  function renderRoiHistory() {
    if (!el.roiHistoryList) return;
    const history = (state.job && state.job.settings && Array.isArray(state.job.settings.roi_history))
      ? state.job.settings.roi_history
      : [];
    el.roiHistoryCount.textContent = String(history.length);
    el.roiHistoryList.replaceChildren();
    if (!history.length) {
      const empty = document.createElement("div");
      empty.className = "roi-history-empty";
      empty.textContent = "还没有历史区域。开始提取时，当前使用的字幕区域会自动记录在这里。";
      el.roiHistoryList.appendChild(empty);
      return;
    }
    history.forEach((item) => {
      const roi = item && item.roi;
      if (!roi) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "roi-history-item";
      if (sameRoi(roi, state.roi)) button.classList.add("is-current");
      const thumb = document.createElement("span");
      thumb.className = "roi-history-thumb";
      const box = document.createElement("i");
      box.style.left = `${Number(roi.x) * 100}%`;
      box.style.top = `${Number(roi.y) * 100}%`;
      box.style.width = `${Number(roi.w) * 100}%`;
      box.style.height = `${Number(roi.h) * 100}%`;
      thumb.appendChild(box);
      const copy = document.createElement("span");
      copy.className = "roi-history-copy";
      const name = document.createElement("b");
      name.textContent = describeRoi(roi);
      const meta = document.createElement("small");
      const used = Math.max(1, Number(item.uses) || 1);
      meta.textContent = [formatHistoryTime(item.used_at), `使用 ${used} 次`].filter(Boolean).join(" · ");
      copy.append(name, meta);
      const apply = document.createElement("span");
      apply.className = "roi-history-apply";
      apply.textContent = sameRoi(roi, state.roi) ? "当前" : "应用";
      button.append(thumb, copy, apply);
      button.addEventListener("click", () => {
        setRoi(roi);
        renderRoiHistory();
        el.videoStage.scrollIntoView({ behavior: "smooth", block: "center" });
        el.roi.classList.remove("is-flash");
        void el.roi.offsetWidth;
        el.roi.classList.add("is-flash");
        setTimeout(() => el.roi.classList.remove("is-flash"), 1000);
        toast("已应用历史字幕区域", "success");
      });
      el.roiHistoryList.appendChild(button);
    });
  }

  function initRoi() {
    $$(".handle", el.roi).forEach((handle) => {
      handle.addEventListener("pointerdown", (event) => {
        if (state.processing) return;
        event.preventDefault();
        event.stopPropagation();
        beginDrag(event, handle.dataset.dir);
      });
    });
    el.roi.addEventListener("pointerdown", (event) => {
      if (state.processing) return;
      if (event.target.closest(".handle")) return;
      event.preventDefault();
      event.stopPropagation();
      beginDrag(event, "move");
    });
    el.roi.addEventListener("pointermove", onDragMove);
    el.roi.addEventListener("pointerup", endDrag);
    el.roi.addEventListener("pointercancel", endDrag);
    window.addEventListener("pointermove", (event) => {
      if (state.dragging) onDragMove(event);
    });
    window.addEventListener("pointerup", endDrag);

    $$(".mini-btn[data-preset]").forEach((button) => {
      button.addEventListener("click", () => {
        if (state.processing) return;
        setRoi(PRESETS[button.dataset.preset]);
      });
    });

    el.autoRegion.addEventListener("click", autoDetectRegion);

    el.minTextGuideBtn.addEventListener("click", toggleMinTextGuide);
    initMinTextGuideDrag();
    window.addEventListener("resize", updateMinTextGuide);
    el.roiLocate.addEventListener("click", () => {
      el.videoStage.scrollIntoView({ behavior: "smooth", block: "center" });
      el.roi.classList.remove("is-flash");
      void el.roi.offsetWidth;
      el.roi.classList.add("is-flash");
      setTimeout(() => el.roi.classList.remove("is-flash"), 1000);
    });
    el.roiHistoryToggle.addEventListener("click", () => {
      const opening = el.roiHistoryList.hidden;
      el.roiHistoryList.hidden = !opening;
      el.roiHistoryToggle.setAttribute("aria-expanded", opening ? "true" : "false");
    });
    el.roiApply.addEventListener("click", applyRoiInputs);
    [el.roiX, el.roiY, el.roiW, el.roiH].forEach((input) => {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          applyRoiInputs();
        }
      });
    });
  }

  function beginDrag(event, mode) {
    const rect = el.videoStage.getBoundingClientRect();
    state.dragging = {
      mode,
      startX: event.clientX,
      startY: event.clientY,
      rect,
      roi: { ...state.roi },
    };
    el.roi.setPointerCapture && el.roi.setPointerCapture(event.pointerId);
  }

  function onDragMove(event) {
    const drag = state.dragging;
    if (!drag) return;
    event.preventDefault();
    const dx = (event.clientX - drag.startX) / drag.rect.width;
    const dy = (event.clientY - drag.startY) / drag.rect.height;
    let { x, y, w, h } = drag.roi;
    const min = 0.04;

    if (drag.mode === "move") {
      x = clamp(x + dx, 0, 1 - w);
      y = clamp(y + dy, 0, 1 - h);
    } else {
      if (drag.mode.includes("e")) w = clamp(w + dx, min, 1 - x);
      if (drag.mode.includes("s")) h = clamp(h + dy, min, 1 - y);
      if (drag.mode.includes("w")) {
        const nextX = clamp(x + dx, 0, x + w - min);
        w = x + w - nextX;
        x = nextX;
      }
      if (drag.mode.includes("n")) {
        const nextY = clamp(y + dy, 0, y + h - min);
        h = y + h - nextY;
        y = nextY;
      }
    }
    state.roi = normalizeRoi({ x, y, w, h });
    drawRoi();
    markPreset();
  }

  function endDrag() {
    if (!state.dragging) return;
    state.dragging = null;
  }

  async function autoDetectRegion() {
    if (!state.job || state.processing) return;
    el.autoRegion.disabled = true;
    el.autoRegion.classList.add("is-loading");
    const original = el.autoRegion.innerHTML;
    el.autoRegion.innerHTML = '<span class="spinner small"></span> 检测中';
    try {
      const result = await api(`/api/jobs/${state.job.id}/detect-region`, {
        method: "POST",
        body: JSON.stringify({
          languages: selectedLanguages(),
          extraction_start: parseCueTime(el.extractionStart.value) ?? 0,
          extraction_end: parseCueTime(el.extractionEnd.value) ?? state.duration,
        }),
      });
      if (result && result.roi) {
        setRoi(result.roi);
        toast(result.method === "ocr" ? "已根据画面文字定位字幕区域" : "未找到明显字幕，已使用底部默认区域", "success");
      }
    } catch (error) {
      toast(error.message || "自动检测失败", "error");
    } finally {
      el.autoRegion.disabled = false;
      el.autoRegion.classList.remove("is-loading");
      el.autoRegion.innerHTML = original;
    }
  }

  // ---------------------------------------------------------------- video
  function updateVolumeUI() {
    const muted = el.video.muted || el.video.volume === 0;
    el.volumeSlider.value = String(el.video.volume || 0);
    el.volumeValue.textContent = muted ? "静音" : `${Math.round((el.video.volume || 0) * 100)}%`;
    el.volumeBtn.classList.toggle("is-muted", muted);
    el.volumeBtn.setAttribute("aria-label", muted ? "取消静音" : "静音");
  }

  function applyVolume(value, muted = false) {
    const volume = clamp(Number(value) || 0, 0, 1);
    if (volume > 0) state.lastVolume = volume;
    el.video.volume = volume;
    el.video.muted = muted || volume === 0;
    if (volume > 0) {
      localStorage.setItem("hardsub.volume", String(volume));
    }
    updateVolumeUI();
  }

  function initVolume() {
    const saved = Number(localStorage.getItem("hardsub.volume"));
    state.lastVolume = Number.isFinite(saved) && saved > 0 ? clamp(saved, 0.01, 1) : 1;
    applyVolume(state.lastVolume, false);
    el.volumeSlider.addEventListener("input", () => {
      const value = Number(el.volumeSlider.value);
      applyVolume(value, value === 0);
    });
    el.volumeBtn.addEventListener("click", () => {
      if (el.video.muted || el.video.volume === 0) {
        applyVolume(state.lastVolume > 0 ? state.lastVolume : 1, false);
      } else {
        applyVolume(el.video.volume, true);
      }
    });
    el.video.addEventListener("volumechange", updateVolumeUI);
  }

  function initVideo() {
    el.video.addEventListener("loadedmetadata", () => {
      const width = el.video.videoWidth || 16;
      const height = el.video.videoHeight || 9;
      el.videoStage.style.aspectRatio = `${width} / ${height}`;
      el.videoStage.classList.add("is-ready");
      el.stageEmpty.hidden = true;
      state.duration = el.video.duration || (state.job && state.job.probe ? state.job.probe.duration : 0) || 0;
      el.timeline.max = String(state.duration || 0);
      el.timeline.value = "0";
      updateTimeline();
      updateTimeLabel();
    });
    el.video.addEventListener("error", () => {
      el.stageEmpty.hidden = false;
      el.stageEmpty.textContent = "无法载入视频";
    });
    el.video.addEventListener("play", () => {
      el.playBtn.classList.add("is-playing");
      el.videoStage.classList.add("is-playing");
    });
    el.video.addEventListener("pause", () => {
      el.playBtn.classList.remove("is-playing");
      el.videoStage.classList.remove("is-playing");
    });
    el.video.addEventListener("timeupdate", () => {
      updateTimeline();
      updateTimeLabel();
      updateLiveCaption();
    });
    el.video.addEventListener("seeked", updateLiveCaption);
    el.playBtn.addEventListener("click", togglePlay);
    $$("[data-skip]").forEach((button) => {
      button.addEventListener("click", () => seekBy(Number(button.dataset.skip) || 0));
    });
    el.video.addEventListener("click", togglePlay);
    el.timeline.addEventListener("input", async () => {
      if (!el.video.src) await ensureVideoLoaded();
      el.video.currentTime = Number(el.timeline.value) || 0;
      updateTimeline();
      updateTimeLabel();
    });
    el.overlayToggle.addEventListener("change", () => {
      state.overlay = el.overlayToggle.checked;
      updateLiveCaption();
    });
  }

  function ensureVideoLoaded() {
    if (el.video.src) return Promise.resolve();
    if (!state.videoUrl) return Promise.resolve();
    return new Promise((resolve) => {
      const onReady = () => {
        el.video.removeEventListener("loadedmetadata", onReady);
        resolve();
      };
      el.video.addEventListener("loadedmetadata", onReady);
      el.video.src = state.videoUrl;
      el.video.load();
    });
  }

  async function togglePlay() {
    await ensureVideoLoaded();
    if (!el.video.src) return;
    if (el.video.paused) el.video.play().catch(() => {});
    else el.video.pause();
  }

  async function seekBy(delta) {
    await ensureVideoLoaded();
    if (!el.video.src) return;
    const total = Number.isFinite(el.video.duration) && el.video.duration > 0
      ? el.video.duration
      : (state.duration || 0);
    if (!total) return;
    const target = clamp((el.video.currentTime || 0) + delta, 0, total);
    el.video.currentTime = target;
    updateTimeline();
    updateTimeLabel();
    updateLiveCaption();
  }

  function updateTimeline() {
    const duration = state.duration || el.video.duration || 0;
    const value = el.video.currentTime || 0;
    const pct = duration ? (value / duration) * 100 : 0;
    el.timeline.value = String(value);
    el.timeline.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, rgba(255,255,255,.17) ${pct}%, rgba(255,255,255,.17) 100%)`;
  }

  function updateTimeLabel() {
    const duration = state.duration || el.video.duration || 0;
    el.timeLabel.textContent = `${fmtClock(el.video.currentTime || 0, duration >= 3600)} / ${fmtClock(duration, duration >= 3600)}`;
  }

  function cueAt(time) {
    const cues = state.cues;
    let low = 0;
    let high = cues.length - 1;
    let found = null;
    while (low <= high) {
      const mid = (low + high) >> 1;
      const cue = cues[mid];
      if (time < cue.start) high = mid - 1;
      else if (time > cue.end) low = mid + 1;
      else { found = cue; break; }
    }
    return found;
  }

  function updateLiveCaption() {
    if (!state.cues.length) {
      el.captionOverlay.hidden = true;
      return;
    }
    const cue = cueAt(el.video.currentTime || 0);
    if (cue && cue.text.trim()) {
      el.liveCaption.textContent = cue.text;
      el.liveCaption.classList.remove("empty");
      el.liveTime.textContent = `${fmtClock(cue.start)} – ${fmtClock(cue.end)}`;
      el.captionOverlay.textContent = cue.text;
      el.captionOverlay.hidden = !state.overlay;
      setActiveCue(cue.id);
    } else {
      el.liveCaption.textContent = "此刻没有字幕";
      el.liveCaption.classList.add("empty");
      el.liveTime.textContent = fmtClock(el.video.currentTime || 0);
      el.captionOverlay.hidden = true;
      setActiveCue(null);
    }
  }

  function setActiveCue(id) {
    if (state.activeCueId === id) return;
    state.activeCueId = id;
    $$("tr[data-cue-id]", el.cueBody).forEach((row) => {
      row.classList.toggle("is-current", Number(row.dataset.cueId) === id);
    });
  }

  // ---------------------------------------------------------------- progress / SSE
  function showProgress(job, fromFinished = false) {
    el.progressCard.hidden = false;
    el.progressCard.classList.remove("is-error", "is-done");
    el.progressTitle.textContent = job.status === "processing" ? "正在识别" : "任务状态";
    updateProgress(job);
    if (!fromFinished && job.logs && job.logs.length) {
      el.logBox.replaceChildren();
      job.logs.forEach(appendLog);
    }
    if (job.status === "error" || job.status === "cancelled") {
      el.progressCard.classList.add("is-error");
      el.progressTitle.textContent = job.status === "error" ? "识别失败" : "已取消";
      el.cancelBtn.hidden = true;
      el.progressMessage.textContent = job.error || job.message || "";
    } else if (job.status === "done") {
      el.progressCard.classList.add("is-done");
      el.progressTitle.textContent = "识别完成";
      el.cancelBtn.hidden = true;
    }
  }

  function updateProgress(payload) {
    const pct = Math.round(clamp(Number(payload.progress) || 0, 0, 1) * 100);
    el.progressPct.textContent = `${pct}%`;
    el.progressBar.style.width = `${pct}%`;
    if (payload.message) el.progressMessage.textContent = payload.message;
    updateStages(payload.stage, payload.status);
    if (payload.status === "done") {
      el.progressCard.classList.add("is-done");
      el.progressTitle.textContent = "识别完成";
      el.cancelBtn.hidden = true;
    } else if (payload.status === "error" || payload.status === "cancelled") {
      el.progressCard.classList.add("is-error");
      el.progressTitle.textContent = payload.status === "error" ? "识别失败" : "已取消";
      el.cancelBtn.hidden = true;
    } else {
      el.cancelBtn.hidden = false;
    }
  }

  function updateStages(stage, status) {
    let index = STAGE_ORDER.indexOf(stage);
    if (stage === "export") index = 2;
    if (status === "done") index = 3;
    if (index < 0) index = 0;
    $$(".stage-item", el.stageList).forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === index && status === "processing");
      item.classList.toggle("is-done", itemIndex < index || status === "done");
    });
  }

  function appendLog(entry) {
    if (!entry) return;
    const line = document.createElement("div");
    line.className = `log-line ${entry.level || ""}`.trim();
    const time = document.createElement("time");
    time.textContent = entry.time || "";
    const message = document.createElement("span");
    message.textContent = entry.message || "";
    line.append(time, message);
    el.logBox.appendChild(line);
    while (el.logBox.children.length > 160) el.logBox.firstChild.remove();
    el.logBox.scrollTop = el.logBox.scrollHeight;
  }

  function connectEvents(jobId) {
    closeEvents();
    startPolling(jobId);
    const es = new EventSource(`/api/jobs/${jobId}/events`);
    state.es = es;
    es.onmessage = (event) => {
      let payload = null;
      try { payload = JSON.parse(event.data); } catch (_) { return; }
      handleEvent(payload);
    };
    es.onerror = () => {
      if (!state.finished && state.job && state.job.status === "processing") {
        el.progressMessage.textContent = "连接暂时中断，正在自动重连…";
      }
    };
  }

  function closeEvents() {
    if (state.es) {
      state.es.close();
      state.es = null;
    }
    if (state.pollTimer) {
      clearInterval(state.pollTimer);
      state.pollTimer = null;
    }
  }

  function startPolling(jobId) {
    if (state.pollTimer) clearInterval(state.pollTimer);
    state.pollTimer = setInterval(async () => {
      if (!state.processing || !state.job || state.job.id !== jobId) return;
      try {
        const job = await api(`/api/jobs/${jobId}`);
        if (job.status !== "processing") await finalizeFromServer(jobId, job);
      } catch (_) { /* transient; SSE remains primary */ }
    }, 2600);
  }

  async function finalizeFromServer(jobId, providedJob = null) {
    if (state.finalizing) return;
    state.finalizing = true;
    state.finished = true;
    closeEvents();
    try {
      const job = providedJob || await api(`/api/jobs/${jobId}`);
      state.job = { ...(state.job || {}), ...job };
      state.cues = Array.isArray(job.cues) ? job.cues : [];
      state.dirty = false;
      setProcessing(false);
      if (job.status === "done") {
        el.progressCard.hidden = true;
        clearPartialCues();
        renderResults();
        el.startBtn.querySelector("span").textContent = "重新提取字幕";
        toast(`识别完成，共 ${state.cues.length} 条字幕`, "success");
      } else {
        showProgress(job, true);
        el.startBtn.querySelector("span").textContent = "重新尝试";
        toast(job.error || "任务未能完成", "error");
      }
      loadRecent();
    } catch (error) {
      toast(error.message || "无法读取任务结果", "error");
    } finally {
      state.finalizing = false;
    }
  }

  async function handleEvent(payload) {
    if (payload.type === "snapshot") {
      if (payload.job) {
        state.job = { ...state.job, ...payload.job };
        if (state.job.status === "processing") {
          setProcessing(true);
          el.progressCard.hidden = false;
          updateProgress(state.job);
          if (Array.isArray(payload.job.partial_cues)) renderPartialCues(payload.job.partial_cues);
        } else if (state.job.status === "done" || state.job.status === "error" || state.job.status === "cancelled") {
          const full = Array.isArray(payload.job.cues) ? payload.job : state.job;
          await finalizeFromServer(state.job.id, full);
        }
      }
      return;
    }
    if (payload.type === "log") {
      appendLog(payload.log);
      return;
    }
    if (payload.type === "partial") {
      renderPartialCues(payload.cues || []);
      return;
    }
    if (payload.type === "state") {
      state.job = { ...state.job, ...payload };
      if (payload.status === "processing") {
        setProcessing(true);
        el.progressCard.hidden = false;
      }
      updateProgress(payload);
      return;
    }
    if (payload.type === "edited") {
      if (payload.stats) state.job.stats = payload.stats;
      return;
    }
    if (payload.type === "finished") {
      const full = Array.isArray(payload.cues) ? payload : (payload.job || null);
      await finalizeFromServer(payload.id, full);
    }
  }

  // ---------------------------------------------------------------- results
  function clearPartialCues() {
    state.partialCues = [];
    if (el.partialPreview) {
      el.partialPreview.hidden = true;
      el.partialList.replaceChildren();
    }
  }

  function renderPartialCues(cues) {
    if (!el.partialPreview) return;
    if (!Array.isArray(cues) || !cues.length) {
      clearPartialCues();
      return;
    }
    state.partialCues = cues;
    const wasNearBottom = el.partialList.scrollHeight - el.partialList.scrollTop - el.partialList.clientHeight < 48;
    el.partialPreview.hidden = false;
    el.partialCount.textContent = `${cues.length} 条`;
    const fragment = document.createDocumentFragment();
    cues.forEach((cue) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "partial-row";
      const time = document.createElement("span");
      time.className = "partial-time";
      time.textContent = `${fmtCueTime(cue.start)} – ${fmtCueTime(cue.end)}`;
      const text = document.createElement("span");
      text.className = "partial-text";
      text.textContent = cue.text || "";
      row.append(time, text);
      row.addEventListener("click", () => seekToCue(cue));
      fragment.appendChild(row);
    });
    el.partialList.replaceChildren(fragment);
    if (wasNearBottom) el.partialList.scrollTop = el.partialList.scrollHeight;
  }

  function updateAssDownloadLink() {
    if (!state.job) return;
    const params = new URLSearchParams({
      font_name: el.fontName.value || "Kaiti SC",
      font_size: String(Number(el.fontSize.value) || 70),
      border_width: String(Number(el.borderWidth.value) || 2),
    });
    el.downloadAss.href = `/api/jobs/${state.job.id}/download/ass?${params.toString()}`;
  }

  function switchExtractPanel(_panel) {
    // Settings now live below the player; the right panel only contains results.
  }

  function renderResults() {
    const job = state.job;
    if (!job) return;
    el.resultsCard.hidden = false;
    el.resultCount.textContent = `共 ${state.cues.length} 条`;
    switchExtractPanel("results");
    el.downloadSrt.href = `/api/jobs/${job.id}/download/srt`;
    updateAssDownloadLink();
    el.saveBtn.disabled = false;
    el.saveState.textContent = "";
    el.saveState.classList.remove("is-dirty");
    renderStats();
    renderCuePage();
    el.resultsCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function renderStats() {
    const job = state.job;
    const stats = (job && job.stats) || {};
    const chips = [];
    const add = (label, value) => chips.push({ label, value });
    add("字幕", `${state.cues.length} 条`);
    add("平均置信度", `${Math.round((Number(stats.avg_confidence) || 0) * 100)}%`);
    add("文字", `${state.cues.reduce((n, cue) => n + (cue.text || "").length, 0)} 字`);
    const totalDuration = state.duration || 0;
    let rangeStart = stats.extraction_start ?? (state.job && state.job.settings ? state.job.settings.extraction_start : 0) ?? 0;
    let rangeEnd = stats.extraction_end ?? (state.job && state.job.settings ? state.job.settings.extraction_end : null);
    if (rangeEnd == null) rangeEnd = totalDuration;
    rangeStart = Number(rangeStart) || 0;
    rangeEnd = Number(rangeEnd) || totalDuration;
    if (rangeStart > 0.2 || (totalDuration && rangeEnd < totalDuration - 0.5)) {
      add("范围", `${fmtClock(rangeStart)}–${fmtClock(rangeEnd)}`);
    }
    if (stats.elapsed) add("耗时", fmtDuration(stats.elapsed));
    if (stats.frames) add("识别帧", `${stats.frames}`);
    el.resultStats.replaceChildren();
    chips.forEach(({ label, value }) => {
      const chip = document.createElement("span");
      chip.className = "stat-chip";
      chip.append(document.createTextNode(label), document.createElement("b"));
      chip.querySelector("b").textContent = value;
      el.resultStats.appendChild(chip);
    });
  }

  function filteredCues() {
    const query = state.filter.trim().toLowerCase();
    const minimum = Number(state.minConfidence) || 0;
    const maximum = Number.isFinite(state.maxConfidence) ? state.maxConfidence : 1;
    return state.cues.filter((cue) => {
      const confidence = Number(cue.confidence) || 0;
      if (confidence + 1e-9 < minimum) return false;
      if (confidence - 1e-9 > maximum) return false;
      return !query || (cue.text || "").toLowerCase().includes(query);
    });
  }

  const KANA_PATTERN = /[\u3040-\u30ff\u31f0-\u31ff\uff66-\uff9f]/;
  const HANGUL_PATTERN = /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/;
  const HAN_PATTERN = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;
  const LATIN_PATTERN = /[A-Za-z]/;

  function classifyText(text) {
    if (!text) return "unknown";
    if (KANA_PATTERN.test(text)) return "ja";
    if (HANGUL_PATTERN.test(text)) return "ko";
    if (HAN_PATTERN.test(text)) return "zh";
    if (LATIN_PATTERN.test(text)) return "en";
    return "unknown";
  }

  function languageAllowed(text, languages) {
    const kind = classifyText(text);
    return kind === "unknown" || languages.includes(kind);
  }

  function toggleCueSelection(id) {
    if (state.selected.has(id)) state.selected.delete(id);
    else state.selected.add(id);
    updateSelectionUI();
  }

  function selectCueRange(id) {
    const ids = state.pageCueIds;
    let anchor = state.selectionAnchor;
    if (!ids.includes(anchor)) anchor = id;
    const from = ids.indexOf(anchor);
    const to = ids.indexOf(id);
    if (from < 0 || to < 0) {
      state.selected.add(id);
      state.selectionAnchor = id;
      updateSelectionUI();
      return;
    }
    const low = Math.min(from, to);
    const high = Math.max(from, to);
    for (let index = low; index <= high; index += 1) state.selected.add(ids[index]);
    updateSelectionUI();
  }

  function updateSelectionUI() {
    const known = new Set(state.cues.map((cue) => cue.id));
    state.selected = new Set([...state.selected].filter((id) => known.has(id)));
    const count = state.selected.size;
    el.selectedCount.textContent = `已选 ${count} 条`;
    el.mergeBtn.disabled = count < 2;
    el.deleteSelectedBtn.disabled = count === 0;
    el.cleanLangBtn.disabled = state.cues.length === 0;
    el.dedupeBtn.disabled = state.cues.length === 0;
    el.undoBtn.disabled = state.undoStack.length === 0;
    el.redoBtn.disabled = state.redoStack.length === 0;
    const lastUndo = state.undoStack[state.undoStack.length - 1];
    const lastRedo = state.redoStack[state.redoStack.length - 1];
    el.undoBtn.title = lastUndo ? `撤销：${lastUndo.label} (⌘Z)` : "撤销 (⌘Z)";
    el.redoBtn.title = lastRedo ? `重做：${lastRedo.label} (⇧⌘Z)` : "重做 (⇧⌘Z)";
    el.offsetBtn.textContent = count ? "平移所选" : "平移全部";
    el.offsetBtn.title = count
      ? `把勾选的 ${count} 条字幕整体平移`
      : "没有勾选时平移全部字幕";
    const pageSelected = state.pageCueIds.filter((id) => state.selected.has(id));
    const allPageSelected = state.pageCueIds.length > 0 && pageSelected.length === state.pageCueIds.length;
    const somePageSelected = pageSelected.length > 0 && pageSelected.length < state.pageCueIds.length;
    [el.selectAllRows, el.selectAllInline].forEach((box) => {
      if (!box) return;
      box.checked = allPageSelected;
      box.indeterminate = somePageSelected;
    });
    $$("tr[data-cue-id]", el.cueBody).forEach((row) => {
      const id = Number(row.dataset.cueId);
      row.classList.toggle("is-selected", state.selected.has(id));
    });
    $$(".row-check", el.cueBody).forEach((input) => {
      input.checked = state.selected.has(Number(input.dataset.cueId));
    });
  }

  function normalizeCueOrder() {
    state.cues.sort((a, b) => (a.start - b.start) || (a.end - b.end));
    state.cues.forEach((cue, index) => { cue.id = index + 1; });
    state.activeCueId = null;
    state.selected.clear();
    state.selectionAnchor = null;
  }

  function pushUndo(label) {
    state.undoStack.push({
      label,
      cues: state.cues.map((cue) => ({ ...cue })),
    });
    if (state.undoStack.length > 30) state.undoStack.shift();
    state.redoStack = [];
    state.textEditActive = false;
    state.textEditCueId = null;
    clearTimeout(state.textEditTimer);
    updateSelectionUI();
  }

  function renderCuePage() {
    const list = filteredCues();
    const rows = list;
    state.pageCueIds = rows.map((cue) => cue.id);
    el.cueBody.replaceChildren();

    rows.forEach((cue) => {
      const tr = document.createElement("tr");
      tr.dataset.cueId = String(cue.id);

      const checkCell = document.createElement("td");
      checkCell.className = "col-check";
      const check = document.createElement("input");
      check.type = "checkbox";
      check.className = "row-check";
      check.dataset.cueId = String(cue.id);
      check.checked = state.selected.has(cue.id);
      check.title = "选择这条字幕";
      checkCell.appendChild(check);
      tr.appendChild(checkCell);

      const indexCell = document.createElement("td");
      indexCell.className = "cue-index col-id";
      indexCell.textContent = String(cue.id).padStart(2, "0");
      tr.appendChild(indexCell);

      ["start", "end"].forEach((field) => {
        const cell = document.createElement("td");
        cell.className = `col-time col-${field}`;
        const input = document.createElement("input");
        input.className = "time-input";
        input.value = fmtCueTime(cue[field]);
        input.dataset.field = field;
        input.dataset.cueId = String(cue.id);
        input.spellcheck = false;
        input.title = "修改时间（时:分:秒.毫秒）";
        cell.appendChild(input);
        tr.appendChild(cell);
      });

      const textCell = document.createElement("td");
      textCell.className = "col-text";
      const text = document.createElement("div");
      text.className = "cue-text";
      text.contentEditable = "true";
      text.spellcheck = false;
      text.dataset.field = "text";
      text.dataset.cueId = String(cue.id);
      text.textContent = cue.text;
      textCell.appendChild(text);
      tr.appendChild(textCell);

      const confidenceCell = document.createElement("td");
      confidenceCell.className = "col-conf";
      const confidence = Number(cue.confidence) || 0;
      const pill = document.createElement("span");
      pill.className = `conf-pill ${confidence < 0.5 ? "low" : ""}`.trim();
      pill.textContent = `${Math.round(confidence * 100)}%`;
      confidenceCell.appendChild(pill);
      tr.appendChild(confidenceCell);

      const actionCell = document.createElement("td");
      actionCell.className = "col-actions";
      const actions = document.createElement("div");
      actions.className = "row-actions";
      const play = document.createElement("button");
      play.type = "button";
      play.className = "row-play";
      play.title = "从这条字幕开始播放";
      play.innerHTML = '<svg viewBox="0 0 16 16" fill="none"><path d="M5 3.2v9.6l7-4.8z" fill="currentColor"/></svg>';
      play.addEventListener("click", () => seekToCue(cue, true));
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "row-delete";
      remove.title = "删除这条字幕";
      remove.innerHTML = '<svg viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M6.2 4.5V3h3.6v1.5M5 4.5l.5 8h5l.5-8M6.8 7v3.5M9.2 7v3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      remove.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteCue(cue.id);
      });
      actions.append(play, remove);
      actionCell.appendChild(actions);
      tr.appendChild(actionCell);

      if (state.activeCueId === cue.id) tr.classList.add("is-current");
      if (state.selected.has(cue.id)) tr.classList.add("is-selected");
      el.cueBody.appendChild(tr);
    });

    el.tableCount.textContent = list.length
      ? `显示 ${list.length} / 共 ${state.cues.length} 条`
      : "没有匹配的字幕";
    el.visibleCount.textContent = list.length ? `当前显示 ${list.length} 条` : "当前没有匹配字幕";
    el.resultCount.textContent = `共 ${state.cues.length} 条`;
    updateSelectionUI();
    updateCleanButton();
  }

  async function seekToCue(cue, play = false) {
    await ensureVideoLoaded();
    const target = Math.max(0, Math.min(state.duration || cue.start, cue.start + 0.02));
    el.video.currentTime = target;
    updateTimeline();
    updateTimeLabel();
    updateLiveCaption();
    if (play) el.video.play().catch(() => {});
  }

  function getCue(id) {
    return state.cues.find((cue) => cue.id === id);
  }

  function refreshAfterEdit() {
    normalizeCueOrder();
    state.filter = el.searchInput.value;
    renderCuePage();
    renderStats();
    if (!state.cues.length) {
      el.captionOverlay.hidden = true;
      el.liveCaption.textContent = "播放视频，这里会显示当前时间轴上的识别结果。";
      el.liveCaption.classList.add("empty");
    } else {
      updateLiveCaption();
    }
    markDirty();
  }

  function deleteCue(id) {
    const cue = getCue(id);
    if (!cue) return;
    pushUndo("删除字幕");
    state.cues = state.cues.filter((item) => item.id !== id);
    state.selected.delete(id);
    refreshAfterEdit();
    toast("已删除 1 条字幕，可点「撤销」恢复", "success");
  }

  function deleteSelected() {
    if (!state.selected.size) return;
    const count = state.selected.size;
    pushUndo(`删除 ${count} 条字幕`);
    state.cues = state.cues.filter((cue) => !state.selected.has(cue.id));
    state.selected.clear();
    refreshAfterEdit();
    toast(`已删除 ${count} 条字幕，可点「撤销」恢复`, "success");
  }

  function buildMergedCue(selected) {
    const lines = [];
    selected.forEach((cue) => {
      (cue.text || "").split("\n").forEach((line) => {
        const value = line.trim();
        if (value && !lines.includes(value)) lines.push(value);
      });
    });
    return {
      id: 0,
      start: Math.min(...selected.map((cue) => cue.start)),
      end: Math.max(...selected.map((cue) => cue.end)),
      text: lines.join("\n"),
      confidence: Math.max(...selected.map((cue) => Number(cue.confidence) || 0)),
    };
  }

  function mergeSelected() {
    if (state.selected.size < 2) return;
    const selected = state.cues
      .filter((cue) => state.selected.has(cue.id))
      .sort((a, b) => a.start - b.start);
    if (selected.length < 2) return;
    state.pendingMergeIds = selected.map((cue) => cue.id);
    const merged = buildMergedCue(selected);
    el.mergeTitle.textContent = `确认合并 ${selected.length} 条字幕`;
    el.mergeIntro.textContent = "下面是所选字幕的原始内容和时间。合并后的文字可以直接修改，确认后以输入框中的文字为准。";
    el.mergeCueList.replaceChildren();
    selected.forEach((cue) => {
      const item = document.createElement("div");
      item.className = "merge-cue";
      const meta = document.createElement("div");
      meta.className = "merge-cue-meta";
      meta.textContent = `#${String(cue.id).padStart(2, "0")}  ${fmtCueTime(cue.start)} – ${fmtCueTime(cue.end)}`;
      const text = document.createElement("p");
      text.textContent = cue.text;
      item.append(meta, text);
      el.mergeCueList.appendChild(item);
    });
    el.mergeFinalText.value = merged.text;
    updateMergeRange(merged);
    el.mergeModal.hidden = false;
    document.body.classList.add("no-scroll");
    el.mergeFinalText.focus();
    el.mergeFinalText.setSelectionRange(el.mergeFinalText.value.length, el.mergeFinalText.value.length);
  }

  function mergeSelection() {
    if (!state.pendingMergeIds) return [];
    return state.cues
      .filter((cue) => state.pendingMergeIds.includes(cue.id))
      .sort((a, b) => a.start - b.start);
  }

  function updateMergeRange(merged = null) {
    const selected = mergeSelection();
    if (!selected.length) return;
    const base = merged || buildMergedCue(selected);
    const lines = el.mergeFinalText.value.split("\n").filter((line) => line.trim()).length;
    el.mergeRange.textContent = `${fmtCueTime(base.start)} – ${fmtCueTime(base.end)} · 共 ${lines} 行`;
  }

  function closeMergeModal() {
    el.mergeModal.hidden = true;
    state.pendingMergeIds = null;
    if (el.helpModal.hidden && el.cleanupModal.hidden) document.body.classList.remove("no-scroll");
  }

  function confirmMerge() {
    if (!state.pendingMergeIds) return;
    const selected = state.cues
      .filter((cue) => state.pendingMergeIds.includes(cue.id))
      .sort((a, b) => a.start - b.start);
    if (selected.length < 2) {
      closeMergeModal();
      return;
    }
    const customText = el.mergeFinalText.value.trim();
    if (!customText) {
      toast("合并后的字幕不能为空", "error");
      el.mergeFinalText.focus();
      return;
    }
    const merged = { ...buildMergedCue(selected), text: customText };
    const ids = [...state.pendingMergeIds];
    closeMergeModal();
    pushUndo("合并字幕");
    state.cues = state.cues.filter((cue) => !ids.includes(cue.id));
    state.cues.push(merged);
    state.selected.clear();
    state.selectionAnchor = null;
    refreshAfterEdit();
    toast(`已合并 ${selected.length} 条字幕`, "success");
  }

  function shiftTimes() {
    if (!state.cues.length) return;
    const delta = Number(el.offsetInput.value);
    if (!Number.isFinite(delta) || Math.abs(delta) < 0.001) {
      toast("请输入非 0 的偏移秒数", "error");
      return;
    }
    const targets = state.selected.size
      ? state.cues.filter((cue) => state.selected.has(cue.id))
      : state.cues;
    const label = state.selected.size ? "平移所选字幕" : "平移全部字幕";
    pushUndo(label);
    const maxTime = state.duration || Infinity;
    targets.forEach((cue) => {
      let start = clamp(cue.start + delta, 0, Math.max(0, maxTime - 0.05));
      let end = clamp(cue.end + delta, start + 0.05, maxTime);
      if (end <= start) {
        end = Math.min(maxTime, start + 0.05);
        start = Math.max(0, end - 0.05);
      }
      cue.start = Math.round(start * 1000) / 1000;
      cue.end = Math.round(end * 1000) / 1000;
    });
    refreshAfterEdit();
    toast(`${label} ${delta > 0 ? "+" : ""}${delta.toFixed(2)} 秒`, "success");
  }

  function undoLast() {
    const snapshot = state.undoStack.pop();
    if (!snapshot) return;
    state.redoStack.push({
      label: snapshot.label,
      cues: state.cues.map((cue) => ({ ...cue })),
    });
    if (state.redoStack.length > 30) state.redoStack.shift();
    state.cues = snapshot.cues.map((cue) => ({ ...cue }));
    state.selected.clear();
    state.selectionAnchor = null;
    state.activeCueId = null;
    state.textEditActive = false;
    state.textEditCueId = null;
    clearTimeout(state.textEditTimer);
    renderCuePage();
    renderStats();
    markDirty();
    toast(`已撤销：${snapshot.label}`, "success");
  }

  function redoLast() {
    const snapshot = state.redoStack.pop();
    if (!snapshot) return;
    state.undoStack.push({
      label: snapshot.label,
      cues: state.cues.map((cue) => ({ ...cue })),
    });
    if (state.undoStack.length > 30) state.undoStack.shift();
    state.cues = snapshot.cues.map((cue) => ({ ...cue }));
    state.selected.clear();
    state.selectionAnchor = null;
    state.activeCueId = null;
    state.textEditActive = false;
    state.textEditCueId = null;
    clearTimeout(state.textEditTimer);
    renderCuePage();
    renderStats();
    markDirty();
    toast(`已重做：${snapshot.label}`, "success");
  }

  function canonicalText(text) {
    return (text || "")
      .replace(/\s+/g, "")
      .replace(/[，。！？；：、,.!?;:'"“”‘’（）()\[\]【】《》〈〉…—～·・]/g, "")
      .toLowerCase();
  }

  function lineSimilarity(a, b) {
    if (!a || !b) return 0;
    if (a === b) return 1;
    if (a.length < 2 || b.length < 2) return 0;
    const grams = (value) => {
      const result = [];
      for (let i = 0; i < value.length - 1; i += 1) result.push(value.slice(i, i + 2));
      return result;
    };
    const left = grams(a);
    const right = grams(b);
    const counts = new Map();
    left.forEach((gram) => counts.set(gram, (counts.get(gram) || 0) + 1));
    let overlap = 0;
    right.forEach((gram) => {
      const count = counts.get(gram) || 0;
      if (count > 0) {
        overlap += 1;
        counts.set(gram, count - 1);
      }
    });
    return (2 * overlap) / (left.length + right.length);
  }

  function isTailDuplicate(previousText, nextText) {
    const previousLines = (previousText || "").split("\n").map((line) => line.trim()).filter(Boolean);
    const nextLines = (nextText || "").split("\n").map((line) => line.trim()).filter(Boolean);
    if (!previousLines.length || !nextLines.length) return false;
    if (previousLines.length === 1) {
      return nextLines.length === 1
        && canonicalText(nextLines[0]) === canonicalText(previousLines[0]);
    }
    return nextLines.every((line) => {
      const key = canonicalText(line);
      if (!key) return false;
      return previousLines.some((oldLine) => {
        const oldKey = canonicalText(oldLine);
        if (!oldKey) return false;
        return key === oldKey
          || (key.length === oldKey.length && lineSimilarity(key, oldKey) >= 0.8);
      });
    });
  }

  function cueLabel(cue) {
    return `#${String(cue.id).padStart(2, "0")}`;
  }

  function cleanupHeading(cue) {
    return `${cueLabel(cue)}  ${fmtCueTime(cue.start)} – ${fmtCueTime(cue.end)}`;
  }

  function updateCleanupSelection() {
    const checks = [...el.cleanupList.querySelectorAll('input[data-cleanup-id]')];
    const selected = checks.filter((input) => input.checked).length;
    el.cleanupSelectedCount.textContent = `已选 ${selected} / ${checks.length} 项`;
    el.cleanupSelectAll.checked = checks.length > 0 && selected === checks.length;
    el.cleanupSelectAll.indeterminate = selected > 0 && selected < checks.length;
    el.cleanupConfirm.disabled = selected === 0;
    el.cleanupConfirm.textContent = selected ? `应用选中项 (${selected})` : "应用选中项";
  }

  function openCleanupModal(plan) {
    state.cleanupPlan = plan;
    el.cleanupEyebrow.textContent = plan.eyebrow;
    el.cleanupTitle.textContent = plan.title;
    el.cleanupIntro.textContent = plan.intro;
    el.cleanupSummary.textContent = plan.summary;
    el.cleanupList.replaceChildren();

    plan.items.forEach((item) => {
      const row = document.createElement("label");
      row.className = "cleanup-item";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.dataset.cleanupId = item.id;
      checkbox.addEventListener("change", updateCleanupSelection);
      const main = document.createElement("div");
      main.className = "cleanup-item-main";
      const head = document.createElement("div");
      head.className = "cleanup-item-head";
      const title = document.createElement("b");
      title.textContent = item.heading;
      const tag = document.createElement("span");
      tag.className = "cleanup-tag";
      tag.textContent = item.tag;
      head.append(title, tag);
      main.appendChild(head);

      if (plan.type === "language") {
        const before = document.createElement("div");
        before.className = "cleanup-before";
        item.beforeLines.forEach((line) => {
          const span = document.createElement("span");
          span.className = `cleanup-line${line.removed ? " removed" : ""}`;
          span.textContent = line.text || " ";
          before.appendChild(span);
        });
        const after = document.createElement("div");
        after.className = "cleanup-after";
        after.textContent = item.after || "整条删除";
        main.append(before, after);
      } else {
        const before = document.createElement("div");
        before.className = "cleanup-before";
        item.beforeCues.forEach((cue) => {
          const line = document.createElement("span");
          line.className = "cleanup-cue-line";
          const meta = document.createElement("small");
          meta.textContent = `${cueLabel(cue)} ${fmtCueTime(cue.start)} – ${fmtCueTime(cue.end)}`;
          const text = document.createElement("span");
          text.textContent = cue.text;
          line.append(meta, text);
          before.appendChild(line);
        });
        const after = document.createElement("div");
        after.className = "cleanup-after";
        after.textContent = `${item.after}\n${fmtCueTime(item.start)} – ${fmtCueTime(item.end)}`;
        main.append(before, after);
      }
      row.append(checkbox, main);
      el.cleanupList.appendChild(row);
    });

    updateCleanupSelection();
    el.cleanupModal.hidden = false;
    document.body.classList.add("no-scroll");
    el.cleanupConfirm.focus();
  }

  function closeCleanupModal() {
    el.cleanupModal.hidden = true;
    state.cleanupPlan = null;
    if (el.helpModal.hidden && el.mergeModal.hidden) {
      document.body.classList.remove("no-scroll");
    }
  }

  function openLanguageCleanup() {
    if (!state.cues.length) return;
    const languages = selectedLanguages();
    const items = [];
    let removedLines = 0;
    state.cues
      .slice()
      .sort((a, b) => a.start - b.start)
      .forEach((cue) => {
        const lines = (cue.text || "").split("\n");
        const kept = lines.filter((line) => languageAllowed(line, languages));
        if (kept.length === lines.length) return;
        removedLines += lines.length - kept.length;
        const after = kept.join("\n").trim();
        items.push({
          id: `lang-${cue.id}`,
          cueId: cue.id,
          heading: cleanupHeading(cue),
          tag: after ? `删除 ${lines.length - kept.length} 行` : "删除整条",
          beforeLines: lines.map((line) => ({ text: line, removed: !languageAllowed(line, languages) })),
          after,
        });
      });
    if (!items.length) {
      toast("当前结果已经符合所选语种", "success");
      return;
    }
    openCleanupModal({
      type: "language",
      eyebrow: "LANGUAGE",
      title: "确认清理语种",
      intro: "下面列出所有会受影响的字幕。取消勾选可以跳过对应字幕；只有勾选的项目会在确认后修改。",
      summary: `将删除 ${removedLines} 行非所选语种文字，涉及 ${items.length} 条字幕。`,
      items,
    });
  }

  function openDuplicateCleanup() {
    if (!state.cues.length) return;
    const sorted = [...state.cues].sort((a, b) => (a.start - b.start) || (a.end - b.end));
    const items = [];
    let removedTotal = 0;
    let index = 0;
    while (index < sorted.length - 1) {
      const kept = sorted[index];
      const removed = [];
      let end = kept.end;
      let confidence = Number(kept.confidence) || 0;
      let next = index + 1;
      while (next < sorted.length) {
        const candidate = sorted[next];
        const gap = candidate.start - end;
        if (gap > 0.4 || !isTailDuplicate(kept.text, candidate.text)) break;
        removed.push(candidate);
        end = Math.max(end, candidate.end);
        confidence = Math.max(confidence, Number(candidate.confidence) || 0);
        next += 1;
      }
      if (removed.length) {
        removedTotal += removed.length;
        items.push({
          id: `dup-${kept.id}`,
          keptId: kept.id,
          removeIds: removed.map((cue) => cue.id),
          heading: `${cueLabel(kept)} + ${removed.map(cueLabel).join(" + ")}`,
          tag: `合并 ${removed.length + 1} 条`,
          beforeCues: [kept, ...removed],
          after: kept.text,
          start: kept.start,
          end,
        });
        index = next;
      } else {
        index += 1;
      }
    }
    if (!items.length) {
      toast("没有发现相邻重复字幕", "success");
      return;
    }
    openCleanupModal({
      type: "duplicate",
      eyebrow: "DUPLICATES",
      title: "确认清理重复",
      intro: "下面是检测到的相邻重复尾行。勾选后会保留每组第一条字幕的文字，删除重复项并延长第一条的结束时间。未勾选的组不会改动。",
      summary: `发现 ${items.length} 组相邻重复，合并后减少 ${removedTotal} 条字幕。`,
      items,
    });
  }

  function confirmCleanup() {
    const plan = state.cleanupPlan;
    if (!plan) return;
    const selected = new Set(
      [...el.cleanupList.querySelectorAll("input[data-cleanup-id]")]
        .filter((input) => input.checked)
        .map((input) => input.dataset.cleanupId),
    );
    if (!selected.size) {
      toast("请至少勾选一项", "error");
      return;
    }
    closeCleanupModal();

    if (plan.type === "language") {
      const byCue = new Map(plan.items.map((item) => [item.cueId, item]));
      const next = [];
      state.cues.forEach((cue) => {
        const item = byCue.get(cue.id);
        if (item && selected.has(item.id)) {
          if (!item.after) return;
          next.push({ ...cue, text: item.after });
        } else {
          next.push(cue);
        }
      });
      pushUndo("按语种清理");
      state.cues = next;
      state.selected.clear();
      state.selectionAnchor = null;
      refreshAfterEdit();
      toast(`已按勾选清理 ${selected.size} 条字幕`, "success");
      return;
    }

    const clusters = plan.items.filter((item) => selected.has(item.id));
    const kept = new Map();
    const removeIds = new Set();
    clusters.forEach((item) => {
      const cue = state.cues.find((entry) => entry.id === item.keptId);
      if (!cue) return;
      kept.set(item.keptId, {
        ...cue,
        end: Math.max(cue.end, item.end),
      });
      item.removeIds.forEach((id) => removeIds.add(id));
    });
    pushUndo("清理重复字幕");
    state.cues = state.cues
      .filter((cue) => !removeIds.has(cue.id))
      .map((cue) => kept.get(cue.id) || cue);
    state.selected.clear();
    state.selectionAnchor = null;
    refreshAfterEdit();
    toast(`已按勾选合并 ${removeIds.size} 条重复字幕`, "success");
  }

  function markDirty() {
    state.dirty = true;
    state.editVersion = (state.editVersion || 0) + 1;
    el.saveState.textContent = "有未保存的修改";
    el.saveState.classList.add("is-dirty");
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(() => { saveCues(true); }, 1100);
  }

  async function saveCues(silent = false) {
    if (!state.job || !state.dirty || state.saving) return;
    state.saving = true;
    const version = state.editVersion || 0;
    el.saveState.textContent = "保存中…";
    el.saveState.classList.remove("is-dirty");
    try {
      const data = await api(`/api/jobs/${state.job.id}/cues`, {
        method: "PATCH",
        body: JSON.stringify({ cues: state.cues }),
      });
      if ((state.editVersion || 0) === version) state.dirty = false;
      el.saveState.textContent = state.dirty ? "有未保存的修改" : "已保存";
      el.saveState.classList.toggle("is-dirty", state.dirty);
      el.saveBtn.textContent = "已保存";
      setTimeout(() => { el.saveBtn.textContent = "保存修改"; }, 1300);
      if (!silent) toast("字幕修改已保存", "success");
      if (data.stats) state.job.stats = data.stats;
      renderStats();
      updateCleanButton();
    } catch (error) {
      el.saveState.textContent = "保存失败";
      el.saveState.classList.add("is-dirty");
      toast(error.message || "保存失败", "error");
    } finally {
      state.saving = false;
    }
  }

  function initTableEvents() {
    el.cueBody.addEventListener("input", (event) => {
      const target = event.target;
      const cueId = Number(target.dataset.cueId);
      const cue = getCue(cueId);
      if (!cue) return;
      if (target.dataset.field === "text") {
        if (!state.textEditActive || state.textEditCueId !== cue.id) {
          pushUndo("编辑文字");
          state.textEditActive = true;
          state.textEditCueId = cue.id;
        }
        clearTimeout(state.textEditTimer);
        state.textEditTimer = setTimeout(() => {
          state.textEditActive = false;
          state.textEditCueId = null;
        }, 1200);
        cue.text = target.innerText.replace(/\u00a0/g, " ");
        markDirty();
        if (state.activeCueId === cue.id) updateLiveCaption();
      }
    });

    el.cueBody.addEventListener("focusout", (event) => {
      if (event.target.classList && event.target.classList.contains("cue-text")) {
        state.textEditActive = false;
        state.textEditCueId = null;
      }
    });

    el.cueBody.addEventListener("change", (event) => {
      const target = event.target;
      if (target.classList.contains("row-check")) {
        const id = Number(target.dataset.cueId);
        if (target.checked) state.selected.add(id);
        else state.selected.delete(id);
        state.selectionAnchor = id;
        updateSelectionUI();
        return;
      }
      if (!target.classList.contains("time-input")) return;
      const cueId = Number(target.dataset.cueId);
      const cue = getCue(cueId);
      if (!cue) return;
      const value = parseCueTime(target.value);
      if (value == null) {
        target.value = fmtCueTime(cue[target.dataset.field]);
        toast("时间格式不正确，请使用 00:00:00.000", "error");
        return;
      }
      if (target.dataset.field === "start") {
        if (value >= cue.end - 0.02) {
          target.value = fmtCueTime(cue.start);
          toast("开始时间必须早于结束时间", "error");
          return;
        }
        pushUndo("修改时间");
        cue.start = Math.round(value * 100) / 100;
      } else {
        if (value <= cue.start + 0.02) {
          target.value = fmtCueTime(cue.end);
          toast("结束时间必须晚于开始时间", "error");
          return;
        }
        pushUndo("修改时间");
        cue.end = Math.round(value * 100) / 100;
      }
      target.value = fmtCueTime(cue[target.dataset.field]);
      markDirty();
    });

    el.cueBody.addEventListener("click", (event) => {
      const row = event.target.closest("tr[data-cue-id]");
      if (!row) return;
      if (event.target.closest("button, input")) return;
      const cue = getCue(Number(row.dataset.cueId));
      if (!cue) return;
      if (event.shiftKey) {
        event.preventDefault();
        selectCueRange(cue.id);
        return;
      }
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        toggleCueSelection(cue.id);
        state.selectionAnchor = cue.id;
        return;
      }
      state.selectionAnchor = cue.id;
      seekToCue(cue, false);
    });

    [el.selectAllRows, el.selectAllInline].forEach((box) => {
      if (!box) return;
      box.addEventListener("change", () => {
        if (box.checked) {
          state.pageCueIds.forEach((id) => state.selected.add(id));
          state.selectionAnchor = state.pageCueIds[state.pageCueIds.length - 1] || null;
        } else {
          state.pageCueIds.forEach((id) => state.selected.delete(id));
          state.selectionAnchor = null;
        }
        updateSelectionUI();
      });
    });

    el.mergeBtn.addEventListener("click", mergeSelected);
    el.mergeConfirm.addEventListener("click", confirmMerge);
    el.mergeCancel.addEventListener("click", closeMergeModal);
    el.mergeReset.addEventListener("click", () => {
      const selected = mergeSelection();
      if (!selected.length) return;
      const auto = buildMergedCue(selected);
      el.mergeFinalText.value = auto.text;
      updateMergeRange(auto);
      el.mergeFinalText.focus();
    });
    el.mergeFinalText.addEventListener("input", () => updateMergeRange());
    $$("[data-merge-close]", el.mergeModal).forEach((node) => {
      node.addEventListener("click", closeMergeModal);
    });
    $$("[data-cleanup-close]", el.cleanupModal).forEach((node) => {
      node.addEventListener("click", closeCleanupModal);
    });
    el.cleanupCancel.addEventListener("click", closeCleanupModal);
    el.cleanupConfirm.addEventListener("click", confirmCleanup);
    el.cleanupSelectAll.addEventListener("change", () => {
      el.cleanupList.querySelectorAll('input[data-cleanup-id]').forEach((input) => {
        input.checked = el.cleanupSelectAll.checked;
      });
      updateCleanupSelection();
    });
    el.deleteSelectedBtn.addEventListener("click", deleteSelected);
    el.cleanLangBtn.addEventListener("click", openLanguageCleanup);
    el.dedupeBtn.addEventListener("click", openDuplicateCleanup);
    el.undoBtn.addEventListener("click", undoLast);
    el.redoBtn.addEventListener("click", redoLast);
    el.offsetBtn.addEventListener("click", shiftTimes);

    el.searchInput.addEventListener("input", () => {
      state.filter = el.searchInput.value;
      renderCuePage();
    });
    el.confidenceFilter.addEventListener("change", () => {
      const value = el.confidenceFilter.value || "all";
      if (value.startsWith("max:")) {
        state.minConfidence = 0;
        state.maxConfidence = Number(value.slice(4)) || 1;
      } else if (value.startsWith("min:")) {
        state.minConfidence = Number(value.slice(4)) || 0;
        state.maxConfidence = 1;
      } else {
        state.minConfidence = 0;
        state.maxConfidence = 1;
      }
      renderCuePage();
    });
    el.saveBtn.addEventListener("click", () => saveCues(false));
    [el.downloadSrt, el.downloadAss].forEach((link) => {
      link.addEventListener("click", async (event) => {
        if (!state.cues.length) {
          event.preventDefault();
          toast("还没有可下载的字幕", "error");
          return;
        }
        if (state.dirty) {
          event.preventDefault();
          await saveCues(true);
          if (!state.dirty) window.location.href = link.href;
        }
      });
    });
  }

  // ---------------------------------------------------------------- start / cancel / delete
  async function startExtraction() {
    if (!state.job || state.processing) return;
    if (state.health && (!state.health.ffmpeg || !state.health.vision)) {
      toast("识别组件未就绪，请先在终端运行 ./setup.sh", "error");
      return;
    }
    if (state.cues.length) {
      const ok = window.confirm("重新提取会覆盖当前识别结果和修改，继续吗？");
      if (!ok) return;
    }
    if (parseCueTime(el.extractionStart.value) == null || parseCueTime(el.extractionEnd.value) == null) {
      toast("提取范围时间格式不正确", "error");
      return;
    }
    const settings = readSettings();
    if (settings.roi.w < 0.05 || settings.roi.h < 0.04) {
      toast("字幕区域太小，请重新框选", "error");
      return;
    }
    if (!(settings.extraction_end > settings.extraction_start + 0.1)) {
      toast("提取结束时间必须晚于开始时间", "error");
      return;
    }
    if (state.dirty) await saveCues(true);
    setProcessing(true);
    el.resultsCard.hidden = true;
    clearPartialCues();
    state.cues = [];
    state.filter = "";
    state.minConfidence = 0;
    state.maxConfidence = 1;
    state.selected.clear();
    state.selectionAnchor = null;
    state.undoStack = [];
    state.redoStack = [];
    state.pageCueIds = [];
    state.activeCueId = null;
    updateSelectionUI();
    el.captionOverlay.hidden = true;
    el.searchInput.value = "";
    el.confidenceFilter.value = "all";
    el.progressCard.hidden = false;
    el.progressCard.classList.remove("is-error", "is-done");
    el.progressCard.scrollIntoView({ behavior: "smooth", block: "start" });
    el.progressTitle.textContent = "正在识别";
    el.progressPct.textContent = "0%";
    el.progressBar.style.width = "0%";
    el.progressMessage.textContent = "正在启动识别引擎…";
    el.logBox.replaceChildren();
    el.logBox.classList.remove("is-collapsed");
    el.logToggle.textContent = "收起";
    el.cancelBtn.hidden = false;
    setStagesInitial();
    try {
      const job = await api(`/api/jobs/${state.job.id}/start`, {
        method: "POST",
        body: JSON.stringify({ settings }),
      });
      state.job = { ...state.job, ...job };
      renderRoiHistory();
      state.finished = false;
      connectEvents(state.job.id);
      toast("已开始识别，请保持页面打开", "success");
    } catch (error) {
      setProcessing(false);
      toast(error.message || "无法开始识别", "error");
      el.progressCard.hidden = true;
    }
  }

  function setStagesInitial() {
    $$(".stage-item", el.stageList).forEach((item, index) => {
      item.classList.toggle("is-active", index === 0);
      item.classList.remove("is-done");
    });
  }

  async function cancelTask() {
    if (!state.job || !state.processing) return;
    el.cancelBtn.disabled = true;
    try {
      await api(`/api/jobs/${state.job.id}/cancel`, { method: "POST", body: "{}" });
      el.progressMessage.textContent = "正在取消，等待当前帧处理完成…";
      el.cancelBtn.textContent = "正在取消…";
    } catch (error) {
      toast(error.message || "取消失败", "error");
    } finally {
      setTimeout(() => { el.cancelBtn.disabled = false; el.cancelBtn.textContent = "取消任务"; }, 2000);
    }
  }

  async function deleteTask() {
    if (!state.job) return;
    if (state.processing) {
      toast("任务正在运行，请先取消", "error");
      return;
    }
    if (!window.confirm("删除这个任务和本地缓存文件？此操作不可撤销。")) return;
    try {
      await api(`/api/jobs/${state.job.id}`, { method: "DELETE" });
      showLanding();
      toast("任务已删除", "success");
    } catch (error) {
      toast(error.message || "删除失败", "error");
    }
  }

  // ---------------------------------------------------------------- subtitle sync
  function parseSubtitleTime(value) {
    const match = String(value || "").trim().match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})[,.](\d{1,3})$/);
    if (!match) return null;
    const ms = Number(match[4].padEnd(3, "0"));
    return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) + ms / 1000;
  }

  function cleanSubtitleText(value) {
    return String(value || "")
      .replace(/\{\\[^}]*\}/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\\N/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\r/g, "")
      .trim();
  }

  function parseSrt(text) {
    const blocks = text.replace(/^\ufeff/, "").replace(/\r\n?/g, "\n").split(/\n{2,}/);
    const cues = [];
    blocks.forEach((block) => {
      const lines = block.split("\n");
      const timeIndex = lines.findIndex((line) => line.includes("-->"));
      if (timeIndex < 0) return;
      const [left, right] = lines[timeIndex].split("-->");
      const start = parseSubtitleTime(left);
      const end = parseSubtitleTime(right.trim().split(/\s+/)[0]);
      const content = cleanSubtitleText(lines.slice(timeIndex + 1).join("\n"));
      if (start == null || end == null || !content) return;
      cues.push({ start, end: Math.max(end, start + 0.05), text: content });
    });
    return cues;
  }

  function splitAssFields(value, count) {
    const fields = [];
    let rest = value;
    for (let index = 0; index < count - 1; index += 1) {
      const comma = rest.indexOf(",");
      if (comma < 0) {
        fields.push(rest);
        rest = "";
      } else {
        fields.push(rest.slice(0, comma));
        rest = rest.slice(comma + 1);
      }
    }
    fields.push(rest);
    return fields;
  }

  function parseAss(text) {
    const lines = text.replace(/^\ufeff/, "").replace(/\r\n?/g, "\n").split("\n");
    let format = null;
    let section = "";
    const cues = [];
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (/^\[[^\]]+\]$/.test(trimmed)) {
        section = trimmed.toLowerCase();
        return;
      }
      if (section === "[events]" && /^Format\s*:/i.test(trimmed)) {
        format = trimmed.slice(trimmed.indexOf(":") + 1).split(",").map((part) => part.trim());
        return;
      }
      if (!/^Dialogue\s*:/i.test(trimmed)) return;
      if (!format) format = ["Layer", "Start", "End", "Style", "Name", "MarginL", "MarginR", "MarginV", "Effect", "Text"];
      const fields = splitAssFields(trimmed.slice(trimmed.indexOf(":") + 1).trim(), format.length);
      const startAt = format.indexOf("Start");
      const endAt = format.indexOf("End");
      const textAt = format.indexOf("Text");
      if (startAt < 0 || endAt < 0 || textAt < 0) return;
      const start = parseSubtitleTime(fields[startAt]);
      const end = parseSubtitleTime(fields[endAt]);
      const content = cleanSubtitleText(fields.slice(textAt).join(","));
      if (start == null || end == null || !content) return;
      cues.push({ start, end: Math.max(end, start + 0.05), text: content });
    });
    return cues;
  }

  function parseSubtitleText(text, filename) {
    const isAss = /\.(ass|ssa)$/i.test(filename) || /\[Events\]/i.test(text);
    const cues = isAss ? parseAss(text) : parseSrt(text);
    cues.sort((a, b) => a.start - b.start || a.end - b.end);
    cues.forEach((cue, index) => { cue.id = index + 1; });
    return cues;
  }

  async function readSubtitleFile(file) {
    const buffer = await file.arrayBuffer();
    let text = new TextDecoder("utf-8").decode(buffer);
    if (text.includes("\ufffd")) {
      try {
        text = new TextDecoder("gb18030").decode(buffer);
      } catch (_) {
        // Keep UTF-8 output.
      }
    }
    return text;
  }

  function updateSyncAutoButton() {
    el.syncAutoBtn.disabled = !syncState.videoFile || !el.syncSourceJob.value;
  }

  function resetSyncAutoStatus() {
    if (syncState.auto) return;
    setSyncAutoStatus(syncState.videoFile && el.syncSourceJob.value
      ? "已准备好，可以分析两条音轨。分析结果不会自动应用。"
      : "选择原视频和纯净视频后，会根据两条音轨自动估算时间关系。");
  }

  function setSyncAutoStatus(text) {
    el.syncAutoStatus.textContent = text;
  }

  function renderSyncAuto() {
    const data = syncState.pendingAuto || syncState.auto;
    if (!data) {
      el.syncAutoResult.hidden = true;
      el.syncApplyAuto.hidden = true;
      el.syncClearAuto.hidden = true;
      return;
    }
    const confidence = Math.round((Number(data.confidence) || 0) * 100);
    const lines = [];
    if (data.mode === "anchors") {
      lines.push(`分段映射 · ${data.anchors ? data.anchors.length : 0} 个音频点`);
    } else {
      lines.push(`线性映射 · 速度 ${(Number(data.scale) || 1).toFixed(5)}`);
      lines.push(`偏移 ${Number(data.offset) >= 0 ? "+" : ""}${(Number(data.offset) || 0).toFixed(2)}s`);
    }
    lines.push(`音频匹配度 ${confidence}%`);
    lines.push(syncState.auto && !syncState.pendingAuto ? "状态：已应用" : "状态：待确认");
    if (data.usable === false) lines.push(`⚠ ${data.reason || "音轨匹配度过低，自动结果不可靠"}`);
    if (syncState.pendingAuto) lines.push("应用后会替换当前整体偏移和偏移点");
    el.syncAutoMetrics.textContent = lines.join("\n");
    el.syncAutoResult.hidden = false;
    el.syncApplyAuto.hidden = !syncState.pendingAuto;
    el.syncApplyAuto.disabled = !!syncState.pendingAuto && data.usable === false;
    el.syncClearAuto.hidden = !syncState.auto;
  }

  async function loadSyncSources() {
    try {
      const data = await api("/api/jobs");
      const jobs = (data.jobs || []).filter((job) => job.status === "done");
      const previous = el.syncSourceJob.value || localStorage.getItem("hardsub.lastJob");
      el.syncSourceJob.replaceChildren();
      if (!jobs.length) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "没有可用的硬字幕任务";
        el.syncSourceJob.appendChild(option);
        el.syncSourceJob.disabled = true;
      } else {
        el.syncSourceJob.disabled = false;
        jobs.forEach((job) => {
          const option = document.createElement("option");
          option.value = job.id;
          option.textContent = `${job.name} · ${job.cue_count || 0} 条`;
          el.syncSourceJob.appendChild(option);
        });
        if (jobs.some((job) => job.id === previous)) el.syncSourceJob.value = previous;
      }
      updateSyncAutoButton();
    } catch (_) {
      // The sync page still works with manual offsets.
    }
  }

  function alignSyncAudio() {
    if (!syncState.videoFile) {
      toast("请先选择纯净视频", "error");
      return;
    }
    const sourceId = el.syncSourceJob.value;
    if (!sourceId) {
      toast("请选择原硬字幕视频", "error");
      return;
    }
    const form = new FormData();
    form.append("video", syncState.videoFile, syncState.videoFile.name);
    form.append("source_job", sourceId);
    el.syncAutoBtn.disabled = true;
    el.syncAutoBtn.textContent = "正在上传视频…";
    setSyncAutoStatus("正在上传纯净视频，文件只在本机传输。");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/sync/align");
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      el.syncAutoBtn.textContent = `正在上传 ${percent}%…`;
      setSyncAutoStatus(`正在上传纯净视频：${percent}%`);
    };
    xhr.upload.onload = () => {
      el.syncAutoBtn.textContent = "正在分析音频…";
      setSyncAutoStatus("上传完成，正在比较两条音轨，可能需要几十秒。");
    };
    xhr.onerror = () => {
      el.syncAutoBtn.disabled = false;
      el.syncAutoBtn.textContent = "分析音频并对齐";
      updateSyncAutoButton();
      setSyncAutoStatus("上传失败，请重试。");
      toast("自动同步请求失败", "error");
    };
    xhr.onload = () => {
      el.syncAutoBtn.disabled = false;
      el.syncAutoBtn.textContent = "分析音频并对齐";
      let data = null;
      try { data = JSON.parse(xhr.responseText); } catch (_) { data = null; }
      if (xhr.status < 200 || xhr.status >= 300 || !data || data.error) {
        setSyncAutoStatus(data && data.error ? data.error : "自动同步失败，请重试。");
        toast((data && data.error) || "自动同步失败", "error");
        updateSyncAutoButton();
        return;
      }
      syncState.pendingAuto = data;
      renderSyncAuto();
      const confidence = Math.round((Number(data.confidence) || 0) * 100);
      if (data.usable === false) {
        setSyncAutoStatus(`匹配度过低（${confidence}%），自动结果不可信，不能应用。${data.reason || "请确认原视频选对且两段音轨来自同一版本。"}`);
      } else {
        setSyncAutoStatus(`已找到时间关系，匹配度 ${confidence}%。确认应用后才会修改时间轴；应用会替换当前手动偏移和偏移点。`);
      }
      updateSyncAutoButton();
    };
    xhr.send(form);
  }

  function applyAutoSync() {
    if (!syncState.pendingAuto) return;
    if (syncState.pendingAuto.usable === false) {
      toast("匹配度过低，不能应用自动结果；请改用手动偏移", "error");
      return;
    }
    syncState.auto = { ...syncState.pendingAuto };
    syncState.pendingAuto = null;
    syncState.offset = 0;
    syncState.anchors = [];
    el.syncOffset.value = "0.00";
    renderSyncAnchors();
    renderSyncCueList();
    updateSyncOverlay();
    renderSyncAuto();
    setSyncAutoStatus("自动同步已应用，可以继续用整体偏移或偏移点微调。");
    toast("已应用自动同步", "success");
  }

  function clearAutoSync() {
    syncState.auto = null;
    syncState.pendingAuto = null;
    renderSyncAuto();
    renderSyncCueList();
    updateSyncOverlay();
    setSyncAutoStatus("已清除自动同步，当前使用手动偏移。");
    toast("已清除自动同步", "success");
  }

  function syncAnchors() {
    return syncState.anchors.slice().sort((a, b) => a.source - b.source);
  }

  function mapAutoTime(seconds) {
    const auto = syncState.auto;
    if (!auto) return seconds;
    const anchors = (auto.anchors || []).slice().sort((a, b) => a.source - b.source);
    if (auto.mode === "anchors" && anchors.length >= 2) {
      if (seconds <= anchors[0].source) return seconds + anchors[0].target - anchors[0].source;
      const last = anchors[anchors.length - 1];
      if (seconds >= last.source) return seconds + last.target - last.source;
      for (let index = 0; index < anchors.length - 1; index += 1) {
        const left = anchors[index];
        const right = anchors[index + 1];
        if (seconds >= left.source && seconds <= right.source) {
          const span = right.source - left.source;
          const ratio = span > 0.0001 ? (seconds - left.source) / span : 0;
          return left.target + ratio * (right.target - left.target);
        }
      }
      return seconds + last.target - last.source;
    }
    return seconds * (Number(auto.scale) || 1) + (Number(auto.offset) || 0);
  }

  function mapSyncTime(seconds) {
    const value = Math.max(0, Number(seconds) || 0);
    let mapped = mapAutoTime(value);
    let offset = syncState.offset;
    syncAnchors().forEach((anchor) => {
      if (value + 1e-6 >= anchor.source) offset += Number(anchor.delta) || 0;
    });
    return Math.max(0, mapped + offset);
  }

  function syncPointForCue(cue) {
    return syncState.anchors.find((item) => Math.abs(item.source - cue.start) < 0.002) || null;
  }

  function adjustedSyncCues() {
    return syncState.cues.map((cue) => {
      const start = mapSyncTime(cue.start);
      const point = syncPointForCue(cue);
      const endDelta = point ? Number(point.endDelta) || 0 : 0;
      return {
        ...cue,
        adjustedStart: start,
        adjustedEnd: Math.max(start + 0.08, mapSyncTime(cue.end) + endDelta),
      };
    });
  }

  function syncFileName(extension) {
    const base = (syncState.videoName || syncState.subtitleName || "subtitle").replace(/\.[^.]+$/, "");
    return `${base}.${extension}`;
  }

  function updateSyncSummary() {
    if (!syncState.cues.length) {
      el.syncSummary.textContent = "等待载入字幕";
      el.syncOffsetNote.textContent = "正数让字幕延后，负数让字幕提前。偏移点会在整体偏移之上叠加。";
      return;
    }
    const adjusted = adjustedSyncCues();
    const first = adjusted[0];
    const last = adjusted[adjusted.length - 1];
    const count = adjusted.length;
    const base = syncState.offset >= 0 ? `+${syncState.offset.toFixed(2)}` : syncState.offset.toFixed(2);
    const parts = [];
    if (syncState.auto) {
      if (syncState.auto.mode === "anchors") {
        parts.push(`自动 ${syncState.auto.anchors.length} 个音频点`);
      } else {
        const scale = Number(syncState.auto.scale) || 1;
        const offset = Number(syncState.auto.offset) || 0;
        parts.push(`自动 ${scale.toFixed(4)}x ${offset >= 0 ? "+" : ""}${offset.toFixed(2)}s`);
      }
    }
    parts.push(`整体 ${base}s`);
    if (syncState.anchors.length) parts.push(`${syncState.anchors.length} 个偏移点`);
    parts.push(`${count} 条`, `${fmtCueTime(first.adjustedStart)} – ${fmtCueTime(last.adjustedEnd)}`);
    el.syncSummary.textContent = parts.join(" · ");
    if (syncState.auto) {
      el.syncOffsetNote.textContent = "自动同步作为底图；整体偏移和偏移点会在自动结果之上继续调整。";
    } else if (syncState.anchors.length) {
      el.syncOffsetNote.textContent = "整体偏移是基础值；每个偏移点会让该字幕及之后的所有字幕一起移动，多个偏移点按顺序叠加。";
    } else {
      el.syncOffsetNote.textContent = "正数让字幕延后，负数让字幕提前。没有偏移点时整体生效。";
    }
    el.syncOffset.disabled = false;
    $$('[data-sync-nudge]').forEach((button) => { button.disabled = false; });
  }

  function syncAnchorSourceLabel(anchor) {
    return `#${String(anchor.cueId).padStart(2, "0")}  ${fmtCueTime(anchor.source)}`;
  }

  function renderSyncAnchors() {
    el.syncAnchorList.replaceChildren();
    const anchors = syncAnchors();
    el.syncClearAnchors.hidden = anchors.length === 0;
    if (!anchors.length) {
      const empty = document.createElement("div");
      empty.className = "sync-list-empty";
      empty.textContent = "还没有偏移点。只有整体偏移时不需要添加。";
      el.syncAnchorList.appendChild(empty);
      updateSyncSummary();
      return;
    }
    let cumulative = syncState.offset;
    anchors.forEach((anchor) => {
      cumulative += Number(anchor.delta) || 0;
      const row = document.createElement("div");
      row.className = "sync-anchor";
      const copy = document.createElement("div");
      const title = document.createElement("b");
      title.textContent = syncAnchorSourceLabel(anchor);
      const note = document.createElement("small");
      const delta = Number(anchor.delta) || 0;
      const endDelta = Number(anchor.endDelta) || 0;
      const sign = delta >= 0 ? "+" : "";
      const totalSign = cumulative >= 0 ? "+" : "";
      const endSign = endDelta >= 0 ? "+" : "";
      note.textContent = `起点 ${sign}${delta.toFixed(2)}s · 终点 ${endSign}${endDelta.toFixed(2)}s · 累计 ${totalSign}${cumulative.toFixed(2)}s · ${anchor.text || ""}`;
      copy.append(title, note);

      const fields = document.createElement("div");
      fields.className = "sync-point-fields";
      const startField = document.createElement("label");
      startField.className = "sync-point-field";
      startField.title = "该点起的额外偏移，影响这条及之后所有字幕";
      const startLabel = document.createElement("span");
      startLabel.textContent = "起";
      const startInput = document.createElement("input");
      startInput.type = "number";
      startInput.className = "sync-point-delta";
      startInput.step = "0.05";
      startInput.value = delta.toFixed(2);
      startInput.setAttribute("aria-label", "起点偏移秒数");
      startInput.addEventListener("change", () => {
        const value = Number(startInput.value);
        anchor.delta = Number.isFinite(value) ? value : 0;
        renderSyncAnchors();
        renderSyncCueList();
        updateSyncOverlay();
      });
      const startUnit = document.createElement("em");
      startUnit.textContent = "s";
      startField.append(startLabel, startInput, startUnit);

      const endField = document.createElement("label");
      endField.className = "sync-point-field";
      endField.title = "只调整这条字幕结束时间的额外偏移";
      const endLabel = document.createElement("span");
      endLabel.textContent = "尾";
      const endInput = document.createElement("input");
      endInput.type = "number";
      endInput.className = "sync-point-delta end";
      endInput.step = "0.05";
      endInput.value = endDelta.toFixed(2);
      endInput.setAttribute("aria-label", "终点偏移秒数");
      endInput.addEventListener("change", () => {
        const value = Number(endInput.value);
        anchor.endDelta = Number.isFinite(value) ? value : 0;
        renderSyncAnchors();
        renderSyncCueList();
        updateSyncOverlay();
      });
      const endUnit = document.createElement("em");
      endUnit.textContent = "s";
      endField.append(endLabel, endInput, endUnit);
      fields.append(startField, endField);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "×";
      remove.title = "删除这个偏移点";
      remove.addEventListener("click", () => {
        syncState.anchors = syncState.anchors.filter((item) => item !== anchor);
        renderSyncAnchors();
        renderSyncCueList();
        updateSyncOverlay();
      });
      row.append(copy, fields, remove);
      el.syncAnchorList.appendChild(row);
    });
    updateSyncSummary();
  }

  function setSyncOffset(value, normalize = true) {
    const number = Number(value);
    syncState.offset = Number.isFinite(number) ? clamp(number, -3600, 3600) : 0;
    if (normalize) el.syncOffset.value = syncState.offset.toFixed(2);
    updateSyncSummary();
    renderSyncCueList();
    updateSyncOverlay();
  }

  function addSyncAnchor() {
    if (!syncState.cues.length) {
      toast("请先载入字幕文件", "error");
      return;
    }
    if (!syncState.selectedId) {
      toast("先在字幕预览中选中一条字幕", "error");
      return;
    }
    const cue = syncState.cues.find((item) => item.id === syncState.selectedId);
    if (!cue) return;
    const hasVideo = !!el.syncVideo.src;
    let delta = 0;
    if (hasVideo) {
      const target = Number(el.syncVideo.currentTime) || 0;
      const currentMapped = mapSyncTime(cue.start);
      delta = target - currentMapped;
      if (Math.abs(delta) < 0.005) {
        toast("当前位置没有产生偏移；把视频拖到目标位置后再记录", "error");
        return;
      }
    }
    const existing = syncState.anchors.find((item) => Math.abs(item.source - cue.start) < 0.002);
    if (existing) {
      if (hasVideo) existing.delta = (Number(existing.delta) || 0) + delta;
      existing.text = cue.text;
    } else {
      syncState.anchors.push({ cueId: cue.id, source: cue.start, delta, endDelta: 0, text: cue.text });
    }
    syncState.anchors.sort((a, b) => a.source - b.source);
    renderSyncAnchors();
    renderSyncCueList();
    updateSyncOverlay();
    toast(hasVideo
      ? `从这条字幕起偏移 ${delta >= 0 ? "+" : ""}${delta.toFixed(2)}s，后续字幕同步移动`
      : "已添加偏移点，请在右侧「起」输入框填写提前或延后秒数", "success");
  }

  function seekSyncTo(seconds) {
    const duration = Number(el.syncVideo.duration) || 0;
    const target = Math.max(0, duration ? Math.min(seconds, Math.max(0, duration - 0.02)) : seconds);
    if (el.syncVideo.src && Number.isFinite(target)) {
      el.syncVideo.currentTime = target;
      updateSyncOverlay();
    }
  }

  function addSyncEnd() {
    if (!syncState.cues.length) {
      toast("请先载入字幕文件", "error");
      return;
    }
    if (!syncState.selectedId) {
      toast("先在字幕预览中选中一条字幕", "error");
      return;
    }
    const hasVideo = !!el.syncVideo.src;
    const adjusted = adjustedSyncCues();
    const selected = adjusted.find((item) => item.id === syncState.selectedId);
    if (!selected) return;
    let delta = 0;
    if (hasVideo) {
      const target = Number(el.syncVideo.currentTime) || 0;
      if (target <= selected.adjustedStart + 0.04) {
        toast("结束时间必须晚于开始时间", "error");
        return;
      }
      delta = target - selected.adjustedEnd;
      if (Math.abs(delta) < 0.005) {
        toast("当前位置没有产生结束时间偏移", "error");
        return;
      }
    }
    let point = syncState.anchors.find((item) => Math.abs(item.source - selected.start) < 0.002);
    if (!point) {
      point = { cueId: selected.id, source: selected.start, delta: 0, endDelta: 0, text: selected.text };
      syncState.anchors.push(point);
    }
    if (hasVideo) point.endDelta = (Number(point.endDelta) || 0) + delta;
    point.text = selected.text;
    syncState.anchors.sort((a, b) => a.source - b.source);
    renderSyncAnchors();
    renderSyncCueList();
    updateSyncOverlay();
    toast(hasVideo
      ? `这条字幕的结束时间偏移 ${delta >= 0 ? "+" : ""}${delta.toFixed(2)}s`
      : "已添加终点偏移点，请在右侧「尾」输入框填写秒数", "success");
  }

  function seekSyncBy(delta) {
    if (!el.syncVideo.src) return;
    seekSyncTo((Number(el.syncVideo.currentTime) || 0) + Number(delta));
  }

  function renderSyncCueList() {
    el.syncCueList.replaceChildren();
    const adjusted = adjustedSyncCues();
    el.syncCueCount.textContent = `${adjusted.length} 条`;
    el.syncExportSrt.disabled = adjusted.length === 0;
    el.syncExportAss.disabled = adjusted.length === 0;
    if (!adjusted.length) {
      const empty = document.createElement("div");
      empty.className = "sync-list-empty";
      empty.textContent = "载入字幕文件后，这里会显示原始时间与调整后的时间。";
      el.syncCueList.appendChild(empty);
      return;
    }
    const fragment = document.createDocumentFragment();
    adjusted.forEach((cue) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "sync-cue-row";
      row.dataset.id = String(cue.id);
      if (cue.id === syncState.selectedId) row.classList.add("is-selected");
      const times = document.createElement("span");
      times.className = "sync-cue-times";
      times.append(`${fmtCueTime(cue.start)} – ${fmtCueTime(cue.end)}`);
      const mapped = document.createElement("b");
      mapped.textContent = `→ ${fmtCueTime(cue.adjustedStart)} – ${fmtCueTime(cue.adjustedEnd)}`;
      times.appendChild(mapped);
      const text = document.createElement("span");
      text.className = "sync-cue-text";
      text.textContent = cue.text;
      row.append(times, text);
      row.addEventListener("click", () => {
        syncState.selectedId = cue.id;
        $$(".sync-cue-row", el.syncCueList).forEach((node) => {
          node.classList.toggle("is-selected", Number(node.dataset.id) === cue.id);
        });
        seekSyncTo(cue.adjustedStart);
      });
      fragment.appendChild(row);
    });
    el.syncCueList.appendChild(fragment);
    updateSyncSummary();
  }

  function updateSyncOverlay() {
    if (!syncState.cues.length || !el.syncVideo.src) {
      el.syncOverlay.textContent = "";
      return;
    }
    const time = Number(el.syncVideo.currentTime) || 0;
    const adjusted = adjustedSyncCues();
    const active = adjusted.filter((cue) => cue.adjustedStart <= time + 0.001 && cue.adjustedEnd >= time - 0.001);
    el.syncOverlay.textContent = active.map((cue) => cue.text).join("\n");
    const activeIds = new Set(active.map((cue) => cue.id));
    $$(".sync-cue-row", el.syncCueList).forEach((row) => {
      row.classList.toggle("is-current", activeIds.has(Number(row.dataset.id)));
    });
  }

  function fmtSrtTime(seconds) {
    const value = Math.max(0, Number(seconds) || 0);
    const total = Math.round(value * 1000);
    const h = Math.floor(total / 3600000);
    const m = Math.floor((total % 3600000) / 60000);
    const s = Math.floor((total % 60000) / 1000);
    const ms = total % 1000;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
  }

  function fmtAssTime(seconds) {
    const value = Math.max(0, Number(seconds) || 0);
    const total = Math.round(value * 100);
    const h = Math.floor(total / 360000);
    const m = Math.floor((total % 360000) / 6000);
    const s = Math.floor((total % 6000) / 100);
    const cs = total % 100;
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  }

  function downloadBlob(content, filename, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function exportSyncSubtitles(format) {
    if (!syncState.cues.length) {
      toast("请先载入字幕文件", "error");
      return;
    }
    const adjusted = adjustedSyncCues();
    if (format === "srt") {
      const body = adjusted.map((cue, index) => {
        return `${index + 1}\n${fmtSrtTime(cue.adjustedStart)} --> ${fmtSrtTime(cue.adjustedEnd)}\n${cue.text.trim()}\n`;
      }).join("\n");
      downloadBlob(body, syncFileName("srt"), "text/plain;charset=utf-8");
    } else {
      const events = adjusted.map((cue) => {
        const text = cue.text.replace(/\n/g, "\\N").replace(/\{/g, "(").replace(/\}/g, ")");
        return `Dialogue: 0,${fmtAssTime(cue.adjustedStart)},${fmtAssTime(cue.adjustedEnd)},Default,,0,0,0,,${text}`;
      }).join("\n");
      const header = `[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Kaiti SC,48,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,0,0,0,0,100,100,0,0,1,2,1,2,30,30,42,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
      downloadBlob(header + events + "\n", syncFileName("ass"), "text/plain;charset=utf-8");
    }
    toast(`已导出调整后的 ${format.toUpperCase()}`, "success");
  }

  function transcodeSyncVideo() {
    if (!syncState.videoFile) {
      toast("请先选择纯净视频", "error");
      return;
    }
    const file = syncState.videoFile;
    const form = new FormData();
    form.append("video", file, file.name);
    el.syncCompatBtn.disabled = true;
    el.syncCompatBtn.textContent = "正在上传…";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/transcode");
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      el.syncCompatBtn.textContent = `上传 ${Math.round(event.loaded / event.total * 100)}%`;
    };
    xhr.upload.onload = () => { el.syncCompatBtn.textContent = "正在转码…"; };
    xhr.onerror = () => {
      el.syncCompatBtn.disabled = false;
      el.syncCompatBtn.textContent = "兼容预览";
      toast("兼容预览生成失败", "error");
    };
    xhr.onload = () => {
      el.syncCompatBtn.disabled = false;
      el.syncCompatBtn.textContent = "兼容预览";
      let data = null;
      try { data = JSON.parse(xhr.responseText); } catch (_) { data = null; }
      if (xhr.status < 200 || xhr.status >= 300 || !data || data.error) {
        toast((data && data.error) || "兼容预览生成失败", "error");
        return;
      }
      syncState.compatUrl = data.url;
      el.syncVideo.src = data.url;
      el.syncVideo.load();
      el.syncEmpty.hidden = true;
      toast("已生成兼容预览，可以继续对齐和导出", "success");
    };
    xhr.send(form);
  }

  function initSync() {
    el.tabExtract.addEventListener("click", () => switchAppTab("extract"));
    el.extractNewTask.addEventListener("click", () => {
      if (state.dirty && !window.confirm("有未保存的字幕修改，确定新建任务吗？")) return;
      showLanding();
    });
    el.tabSync.addEventListener("click", () => switchAppTab("sync"));
    el.syncNewTask.addEventListener("click", () => clearSyncTask());
    el.syncDeleteSelected.addEventListener("click", deleteSelectedSyncTasks);
    el.syncRunSelected.addEventListener("click", exportSelectedSyncTasks);
    el.syncSelectAll.addEventListener("change", () => {
      selectedSyncTasks.clear();
      if (el.syncSelectAll.checked) {
        el.syncTaskList.querySelectorAll(".task-rail-item").forEach((item) => {
          if (item.dataset.taskId) selectedSyncTasks.add(item.dataset.taskId);
        });
      }
      refreshSyncTasks();
    });
    el.syncVideoInput.addEventListener("change", () => {
      const file = el.syncVideoInput.files && el.syncVideoInput.files[0];
      if (!file) return;
      if (syncState.videoUrl) URL.revokeObjectURL(syncState.videoUrl);
      syncState.videoUrl = URL.createObjectURL(file);
      syncState.videoFile = file;
      syncState.compatUrl = null;
      syncState.videoName = file.name;
      el.syncCompatBtn.disabled = false;
      el.syncCompatBtn.textContent = "兼容预览";
      syncState.auto = null;
      syncState.pendingAuto = null;
      renderSyncAuto();
      el.syncVideoName.textContent = file.name;
      el.syncEmpty.hidden = true;
      el.syncVideo.src = syncState.videoUrl;
      el.syncVideo.load();
      el.syncVideoInput.value = "";
      if (syncState.anchors.length) {
        syncState.anchors = [];
        renderSyncAnchors();
        renderSyncCueList();
      }
      updateSyncAutoButton();
      resetSyncAutoStatus();
      refreshSyncTasks();
      toast("纯净视频已载入", "success");
    });
    el.syncSubInput.addEventListener("change", async () => {
      const file = el.syncSubInput.files && el.syncSubInput.files[0];
      if (!file) return;
      try {
        const text = await readSubtitleFile(file);
        const cues = parseSubtitleText(text, file.name);
        if (!cues.length) throw new Error("没有解析到字幕条目");
        syncState.cues = cues;
        syncState.subtitleName = file.name;
        syncState.offset = 0;
        syncState.anchors = [];
        syncState.selectedId = null;
        syncState.auto = null;
        syncState.pendingAuto = null;
        renderSyncAuto();
        el.syncSubName.textContent = file.name;
        el.syncOffset.value = "0.00";
        renderSyncAnchors();
        renderSyncCueList();
        updateSyncOverlay();
        resetSyncAutoStatus();
        refreshSyncTasks();
        toast(`已载入 ${cues.length} 条字幕`, "success");
      } catch (error) {
        toast(error.message || "字幕文件解析失败", "error");
      } finally {
        el.syncSubInput.value = "";
      }
    });
    el.syncVideo.addEventListener("timeupdate", updateSyncOverlay);
    el.syncVideo.addEventListener("seeked", updateSyncOverlay);
    el.syncVideo.addEventListener("loadedmetadata", () => {
      el.syncEmpty.hidden = true;
      updateSyncOverlay();
    });
    el.syncVideo.addEventListener("error", () => {
      if (el.syncVideo.src) {
        toast("浏览器无法播放这个视频编码，点「兼容预览」生成 H.264 预览", "error");
      }
    });
    el.syncCompatBtn.addEventListener("click", transcodeSyncVideo);
    el.syncAddAnchor.addEventListener("click", addSyncAnchor);
    el.syncAddEnd.addEventListener("click", addSyncEnd);
    $$('[data-sync-skip]').forEach((button) => {
      button.addEventListener("click", () => seekSyncBy(Number(button.dataset.syncSkip)));
    });
    el.syncClearAnchors.addEventListener("click", () => {
      syncState.anchors = [];
      renderSyncAnchors();
      renderSyncCueList();
      updateSyncOverlay();
      toast("已清空偏移点", "success");
    });
    el.syncOffset.addEventListener("input", () => setSyncOffset(el.syncOffset.value, false));
    el.syncOffset.addEventListener("blur", () => setSyncOffset(syncState.offset, true));
    $$('[data-sync-nudge]').forEach((button) => {
      button.addEventListener("click", () => {
        setSyncOffset(syncState.offset + Number(button.dataset.syncNudge));
      });
    });
    el.syncExportSrt.addEventListener("click", () => exportSyncSubtitles("srt"));
    el.syncExportAss.addEventListener("click", () => exportSyncSubtitles("ass"));
    el.syncAutoBtn.addEventListener("click", alignSyncAudio);
    el.syncApplyAuto.addEventListener("click", applyAutoSync);
    el.syncClearAuto.addEventListener("click", clearAutoSync);
    el.syncSourceJob.addEventListener("change", () => {
      syncState.auto = null;
      syncState.pendingAuto = null;
      renderSyncAuto();
      updateSyncAutoButton();
      resetSyncAutoStatus();
    });
    window.addEventListener("keydown", (event) => {
      if (el.syncView.hidden || !el.helpModal.hidden) return;
      const active = document.activeElement;
      if (active && (["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName) || active.isContentEditable)) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      seekSyncBy(event.key === "ArrowLeft" ? -5 : 5);
    });
    updateSyncSummary();
    renderSyncAnchors();
    renderSyncCueList();
    renderSyncAuto();
    loadSyncSources();
  }

  function updateMuxOverlay() {
    if (!muxState.cues.length || !el.muxVideo.src) {
      el.muxOverlay.textContent = "";
      return;
    }
    const time = Number(el.muxVideo.currentTime) || 0;
    const active = muxState.cues.filter((cue) => cue.start <= time + 0.001 && cue.end >= time - 0.001);
    el.muxOverlay.textContent = active.map((cue) => cue.text).join("\n");
  }

  function updateMuxSummary() {
    const rows = el.muxTrackSummary.querySelectorAll("div");
    const values = [
      muxState.videoFile ? muxState.videoFile.name : "未选择",
      muxState.videoFile ? "原样保留" : "原样保留",
      muxState.subtitleFile ? muxState.subtitleFile.name : "未选择",
    ];
    rows.forEach((row, index) => {
      const value = row.querySelector("b");
      if (value && values[index] != null) value.textContent = values[index];
    });
    el.muxStartBtn.disabled = !muxState.videoFile || !muxState.subtitleFile;
  }

  function stopMuxPolling() {
    if (muxState.pollTimer) clearTimeout(muxState.pollTimer);
    muxState.pollTimer = null;
    muxState.pollToken = null;
  }

  function setMuxProgress(percent, label) {
    const value = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));
    el.muxProgress.hidden = false;
    el.muxProgressBar.style.width = `${value}%`;
    el.muxProgressPct.textContent = `${value}%`;
    if (label) el.muxProgressLabel.textContent = label;
  }

  function resetMuxOutput() {
    stopMuxPolling();
    muxState.outputUrl = null;
    el.muxDownload.hidden = true;
    el.muxDownload.removeAttribute("href");
    el.muxProgress.hidden = true;
    el.muxStatus.textContent = muxState.videoFile && muxState.subtitleFile
      ? "已准备好，可以开始封装。"
      : "选择视频和字幕后即可封装。";
    el.muxStartBtn.disabled = !muxState.videoFile || !muxState.subtitleFile;
  }

  function pollMuxStatus(token) {
    const tick = async () => {
      if (muxState.pollToken !== token) return;
      try {
        const data = await api(`/api/mux/${token}/status`);
        if (muxState.pollToken !== token) return;
        if (data.stage === "done") {
          const result = data.result || {};
          setMuxProgress(100, "封装完成");
          const muxSummary = `封装完成：${result.filename || "output.mkv"} · ${(Number(result.size) / 1024 / 1024).toFixed(1)} MB`;
          el.muxStatus.textContent = result.saved_path
            ? `${muxSummary}
已自动保存到：${result.saved_path}`
            : `${muxSummary}
自动保存失败，请点击下方按钮下载。`;
          muxState.outputUrl = result.url;
          el.muxDownload.href = result.url;
          el.muxDownload.download = result.filename || "output.mkv";
          el.muxDownload.textContent = result.saved_path ? "再次下载 MKV" : "下载封装后的 MKV";
          el.muxDownload.hidden = false;
          el.muxStartBtn.disabled = false;
          el.muxStartBtn.textContent = "开始封装";
          muxState.pollTimer = null;
          muxState.pollToken = null;
          toast(result.saved_path ? "MKV 已封装并保存到 Downloads" : "MKV 封装完成", "success");
          refreshMuxTasks();
          return;
        }
        if (data.stage === "error") {
          el.muxProgress.hidden = true;
          el.muxStatus.textContent = data.message || "封装失败";
          el.muxStartBtn.disabled = false;
          el.muxStartBtn.textContent = "开始封装";
          muxState.pollTimer = null;
          muxState.pollToken = null;
          toast(data.message || "封装失败", "error");
          return;
        }
        const percent = Math.round((Number(data.progress) || 0) * 100);
        setMuxProgress(percent, data.stage === "queued" ? "准备封装…" : "正在封装");
        el.muxStatus.textContent = data.message || "正在封装…";
        muxState.pollTimer = setTimeout(tick, 450);
      } catch (error) {
        el.muxProgress.hidden = true;
        el.muxStatus.textContent = error.message || "无法读取封装进度";
        el.muxStartBtn.disabled = false;
        el.muxStartBtn.textContent = "开始封装";
        muxState.pollTimer = null;
        muxState.pollToken = null;
        toast(error.message || "无法读取封装进度", "error");
      }
    };
    tick();
  }

  function muxVideo() {
    if (!muxState.videoFile || !muxState.subtitleFile) {
      toast("请先选择视频和字幕", "error");
      return;
    }
    stopMuxPolling();
    const form = new FormData();
    form.append("video", muxState.videoFile, muxState.videoFile.name);
    form.append("subtitle", muxState.subtitleFile, muxState.subtitleFile.name);
    form.append("language", el.muxLanguage.value);
    form.append("title", el.muxTitle.value.trim() || muxLanguageTitle());
    form.append("offset", el.muxOffset.value || "0");
    form.append("output_name", el.muxOutputName.value.trim());
    form.append("default", el.muxDefault.checked ? "1" : "0");
    el.muxStartBtn.disabled = true;
    el.muxStartBtn.textContent = "正在上传…";
    el.muxDownload.hidden = true;
    setMuxProgress(0, "正在上传");
    el.muxStatus.textContent = "正在上传视频和字幕…";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/mux");
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = Math.round(event.loaded / event.total * 100);
      setMuxProgress(percent, "正在上传");
      el.muxStartBtn.textContent = `正在上传 ${percent}%…`;
      el.muxStatus.textContent = `正在上传：${percent}%`;
    };
    xhr.upload.onload = () => {
      el.muxStartBtn.textContent = "正在封装…";
      setMuxProgress(0, "准备封装…");
      el.muxStatus.textContent = "上传完成，准备封装…";
    };
    xhr.onerror = () => {
      el.muxStartBtn.disabled = false;
      el.muxStartBtn.textContent = "开始封装";
      el.muxProgress.hidden = true;
      el.muxStatus.textContent = "上传失败，请重试。";
      toast("封装请求失败", "error");
    };
    xhr.onload = () => {
      let data = null;
      try { data = JSON.parse(xhr.responseText); } catch (_) { data = null; }
      if (xhr.status < 200 || xhr.status >= 300 || !data || data.error || !data.token) {
        el.muxStartBtn.disabled = false;
        el.muxStartBtn.textContent = "开始封装";
        el.muxProgress.hidden = true;
        el.muxStatus.textContent = (data && data.error) || "封装失败，请重试。";
        toast((data && data.error) || "封装失败", "error");
        return;
      }
      const startedDraft = muxDrafts.findIndex((item) => item.id === muxState.draftId);
      if (startedDraft >= 0) muxDrafts.splice(startedDraft, 1);
      muxState.draftId = null;
      muxState.pollToken = data.token;
      el.muxStartBtn.textContent = "正在封装…";
      setMuxProgress(0, "准备封装…");
      pollMuxStatus(data.token);
    };
    xhr.send(form);
  }

  function cutTimes() {
    const start = parseCueTime(el.cutStart.value);
    const end = parseCueTime(el.cutEnd.value);
    return { start, end };
  }

  function resetCutOutput() {
    if (cutState.pollTimer) clearTimeout(cutState.pollTimer);
    cutState.pollTimer = null;
    cutState.pollToken = null;
    cutState.outputUrl = null;
    el.cutDownload.hidden = true;
    el.cutDownload.removeAttribute("href");
    el.cutProgress.hidden = true;
  }

  function updateCutSummary() {
    if (!cutState.videoFile) {
      el.cutSummary.textContent = "选择视频后设置开始和结束时间。";
      el.cutStartBtn.disabled = true;
      return;
    }
    const { start, end } = cutTimes();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start || start < 0 || (cutState.duration && end > cutState.duration + 0.05)) {
      el.cutSummary.textContent = "请设置有效的开始和结束时间。";
      el.cutStartBtn.disabled = true;
      return;
    }
    const duration = end - start;
    el.cutSummary.textContent = `保留 ${fmtCueTime(start)} – ${fmtCueTime(end)}\n片段时长 ${fmtCueTime(duration)} · 原视频 ${fmtCueTime(cutState.duration)}`;
    el.cutStartBtn.disabled = false;
  }

  function setCutProgress(percent, label) {
    const value = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));
    el.cutProgress.hidden = false;
    el.cutProgressBar.style.width = `${value}%`;
    el.cutProgressPct.textContent = `${value}%`;
    if (label) el.cutProgressLabel.textContent = label;
  }

  function seekCutBy(delta) {
    if (!el.cutVideo.src) return;
    const duration = Number(cutState.duration) || 0;
    const target = Math.max(0, Math.min(duration || Infinity, (Number(el.cutVideo.currentTime) || 0) + Number(delta)));
    el.cutVideo.currentTime = target;
  }

  function pollCutStatus(token) {
    const tick = async () => {
      if (cutState.pollToken !== token) return;
      try {
        const data = await api(`/api/cut/${token}/status`);
        if (cutState.pollToken !== token) return;
        if (data.stage === "done") {
          const result = data.result || {};
          setCutProgress(100, "切割完成");
          const cutSummary = `切割完成：${result.filename || "output_cut.mkv"} · ${(Number(result.size) / 1024 / 1024).toFixed(1)} MB`;
          el.cutStatus.textContent = result.saved_path
            ? `${cutSummary}
已自动保存到：${result.saved_path}`
            : `${cutSummary}
自动保存失败，请点击下方按钮下载。`;
          cutState.outputUrl = result.url;
          el.cutDownload.href = result.url;
          el.cutDownload.download = result.filename || "output_cut.mkv";
          el.cutDownload.textContent = result.saved_path ? "再次下载 MKV" : "下载切割后的 MKV";
          el.cutDownload.hidden = false;
          el.cutStartBtn.disabled = false;
          el.cutStartBtn.textContent = "开始切割";
          cutState.pollTimer = null;
          cutState.pollToken = null;
          toast(result.saved_path ? "视频已切割并保存到 Downloads" : "视频切割完成", "success");
          refreshCutTasks();
          return;
        }
        if (data.stage === "error") {
          el.cutProgress.hidden = true;
          el.cutStatus.textContent = data.message || "切割失败";
          el.cutStartBtn.disabled = false;
          el.cutStartBtn.textContent = "开始切割";
          cutState.pollTimer = null;
          cutState.pollToken = null;
          toast(data.message || "切割失败", "error");
          return;
        }
        setCutProgress(Math.round((Number(data.progress) || 0) * 100), data.stage === "queued" ? "准备切割…" : "正在切割");
        el.cutStatus.textContent = data.message || "正在切割…";
        cutState.pollTimer = setTimeout(tick, 450);
      } catch (error) {
        el.cutProgress.hidden = true;
        el.cutStatus.textContent = error.message || "无法读取切割进度";
        el.cutStartBtn.disabled = false;
        el.cutStartBtn.textContent = "开始切割";
        cutState.pollTimer = null;
        cutState.pollToken = null;
        toast(error.message || "无法读取切割进度", "error");
      }
    };
    tick();
  }

  function startCut() {
    if (!cutState.videoFile) {
      toast("请先选择视频", "error");
      return;
    }
    const { start, end } = cutTimes();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      toast("请设置有效的开始和结束时间", "error");
      return;
    }
    resetCutOutput();
    const form = new FormData();
    form.append("video", cutState.videoFile, cutState.videoFile.name);
    form.append("start", String(start));
    form.append("end", String(end));
    form.append("mode", el.cutMode.value);
    el.cutStartBtn.disabled = true;
    el.cutStartBtn.textContent = "正在上传…";
    el.cutDownload.hidden = true;
    setCutProgress(0, "正在上传");
    el.cutStatus.textContent = "正在上传视频…";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/cut");
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = Math.round(event.loaded / event.total * 100);
      setCutProgress(percent, "正在上传");
      el.cutStartBtn.textContent = `正在上传 ${percent}%…`;
      el.cutStatus.textContent = `正在上传：${percent}%`;
    };
    xhr.upload.onload = () => {
      el.cutStartBtn.textContent = "正在切割…";
      setCutProgress(0, "准备切割…");
      el.cutStatus.textContent = "上传完成，准备切割…";
    };
    xhr.onerror = () => {
      el.cutStartBtn.disabled = false;
      el.cutStartBtn.textContent = "开始切割";
      el.cutProgress.hidden = true;
      el.cutStatus.textContent = "上传失败，请重试。";
      toast("切割请求失败", "error");
    };
    xhr.onload = () => {
      let data = null;
      try { data = JSON.parse(xhr.responseText); } catch (_) { data = null; }
      if (xhr.status < 200 || xhr.status >= 300 || !data || data.error || !data.token) {
        el.cutStartBtn.disabled = false;
        el.cutStartBtn.textContent = "开始切割";
        el.cutProgress.hidden = true;
        el.cutStatus.textContent = (data && data.error) || "切割失败，请重试。";
        toast((data && data.error) || "切割失败", "error");
        return;
      }
      cutState.pollToken = data.token;
      el.cutStartBtn.textContent = "正在切割…";
      setCutProgress(0, "准备切割…");
      pollCutStatus(data.token);
    };
    xhr.send(form);
  }

  function upsertCutDraft() {
    if (!cutState.videoFile) return;
    let task = cutDrafts.find((item) => item.id === cutState.draftId);
    if (!task) {
      const duplicate = cutDrafts.find((item) =>
        item.videoFile && item.videoFile.name === cutState.videoFile.name
        && item.videoFile.size === cutState.videoFile.size
        && item.start === el.cutStart.value && item.end === el.cutEnd.value
        && item.mode === el.cutMode.value
      );
      if (duplicate) {
        cutState.draftId = duplicate.id;
        task = duplicate;
      } else {
        cutDraftSeq += 1;
        cutState.draftId = `cut-draft-${cutDraftSeq}`;
        task = { id: cutState.draftId, status: "draft", created: Date.now() };
        cutDrafts.unshift(task);
      }
    }
    task.name = cutState.videoFile.name;
    task.videoFile = cutState.videoFile;
    task.start = el.cutStart.value;
    task.end = el.cutEnd.value;
    task.mode = el.cutMode.value;
    task.duration = cutState.duration;
    refreshCutTasks();
  }

  function loadCutDraft(task) {
    if (!task || !task.videoFile) return;
    if (cutState.objectUrl) URL.revokeObjectURL(cutState.objectUrl);
    cutState.draftId = task.id;
    cutState.videoFile = task.videoFile;
    cutState.objectUrl = URL.createObjectURL(task.videoFile);
    el.cutVideo.src = cutState.objectUrl;
    el.cutVideo.load();
    el.cutEmpty.hidden = true;
    el.cutVideoName.textContent = task.videoFile.name;
    el.cutStart.value = task.start || "00:00:00.000";
    el.cutEnd.value = task.end || "00:00:00.000";
    el.cutMode.value = task.mode || "copy";
    cutState.duration = Number(task.duration) || 0;
    el.cutDownload.hidden = true;
    el.cutProgress.hidden = true;
    updateCutSummary();
    refreshCutTasks();
  }

  function updateCutSelection() {
    const count = selectedCutTasks.size;
    const draftCount = cutDrafts.filter((task) => selectedCutTasks.has(task.id)).length;
    el.cutRunSelected.disabled = draftCount === 0 || cutBatchBusy;
    el.cutDeleteSelected.disabled = count === 0 || cutBatchBusy;
    el.cutRunSelected.textContent = draftCount ? `执行选中 (${draftCount})` : "执行选中";
    el.cutDeleteSelected.textContent = count ? `删除选中 (${count})` : "删除选中";
    const total = el.cutTaskList.querySelectorAll(".task-check").length;
    el.cutSelectAll.checked = total > 0 && count === total;
    el.cutSelectAll.indeterminate = count > 0 && count < total;
  }

  async function deleteSelectedCutTasks() {
    const ids = [...selectedCutTasks];
    if (!ids.length) return;
    if (!window.confirm(`删除选中的 ${ids.length} 个视频切割任务？`)) return;
    cutBatchBusy = true;
    for (const id of ids) {
      if (String(id).startsWith("cut-draft-")) {
        const index = cutDrafts.findIndex((task) => task.id === id);
        if (index >= 0) cutDrafts.splice(index, 1);
      } else {
        try { await api(`/api/cut/tasks/${id}`, { method: "DELETE" }); } catch (_) {}
      }
    }
    if (ids.includes(cutState.draftId)) clearCutTask();
    selectedCutTasks.clear();
    cutBatchBusy = false;
    refreshCutTasks();
    toast("已删除选中任务", "success");
  }

  async function runSelectedCutTasks() {
    if (cutBatchBusy) return;
    const drafts = cutDrafts.filter((task) => selectedCutTasks.has(task.id));
    if (!drafts.length) {
      toast("请选择待切割任务；已完成任务不能直接重跑", "error");
      return;
    }
    cutBatchBusy = true;
    updateCutSelection();
    let submitted = 0;
    for (const task of drafts) {
      const start = parseCueTime(task.start);
      const end = parseCueTime(task.end);
      if (start == null || end == null || end <= start) continue;
      const form = new FormData();
      form.append("video", task.videoFile, task.videoFile.name);
      form.append("start", String(start));
      form.append("end", String(end));
      form.append("mode", task.mode || "copy");
      try {
        const response = await fetch("/api/cut", { method: "POST", body: form });
        const data = await response.json().catch(() => null);
        if (!response.ok || !data || !data.token) throw new Error("提交失败");
        const index = cutDrafts.findIndex((item) => item.id === task.id);
        if (index >= 0) cutDrafts.splice(index, 1);
        submitted += 1;
      } catch (_) {}
    }
    selectedCutTasks.clear();
    cutBatchBusy = false;
    refreshCutTasks();
    toast(submitted ? `已提交 ${submitted} 个切割任务` : "任务提交失败", submitted ? "success" : "error");
  }

  function initCut() {
    el.cutVideoInput.addEventListener("change", () => {
      const file = el.cutVideoInput.files && el.cutVideoInput.files[0];
      if (!file) return;
      if (cutState.objectUrl) URL.revokeObjectURL(cutState.objectUrl);
      cutState.objectUrl = URL.createObjectURL(file);
      cutState.videoFile = file;
      cutState.duration = 0;
      el.cutVideo.src = cutState.objectUrl;
      el.cutVideo.load();
      el.cutEmpty.hidden = true;
      el.cutVideoName.textContent = file.name;
      el.cutVideoInput.value = "";
      el.cutStart.value = fmtCueTime(0);
      el.cutEnd.value = fmtCueTime(0);
      resetCutOutput();
      updateCutSummary();
      el.cutStatus.textContent = "视频已载入，可以设置切割范围。";
      toast("带字幕视频已载入", "success");
    });
    el.cutVideo.addEventListener("loadedmetadata", () => {
      cutState.duration = Number(el.cutVideo.duration) || 0;
      el.cutStart.value = fmtCueTime(0);
      el.cutEnd.value = fmtCueTime(cutState.duration);
      updateCutSummary();
      upsertCutDraft();
    });
    el.cutStartNow.addEventListener("click", () => {
      el.cutStart.value = fmtCueTime(el.cutVideo.currentTime || 0);
      resetCutOutput();
      updateCutSummary();
      upsertCutDraft();
    });
    el.cutEndNow.addEventListener("click", () => {
      el.cutEnd.value = fmtCueTime(el.cutVideo.currentTime || 0);
      resetCutOutput();
      updateCutSummary();
      upsertCutDraft();
    });
    el.cutReset.addEventListener("click", () => {
      el.cutStart.value = fmtCueTime(0);
      el.cutEnd.value = fmtCueTime(cutState.duration || 0);
      resetCutOutput();
      updateCutSummary();
      upsertCutDraft();
    });
    [el.cutStart, el.cutEnd].forEach((input) => {
      input.addEventListener("input", () => { resetCutOutput(); updateCutSummary(); upsertCutDraft(); });
    });
    $$('[data-cut-skip]').forEach((button) => {
      button.addEventListener("click", () => seekCutBy(Number(button.dataset.cutSkip)));
    });
    el.cutModeNote.textContent = "快速模式复制所有流，速度很快，但从最近关键帧开始，可能保留 1–2 秒广告；内封字幕保持原时间关系。需要精确切割时再切换精确模式。";
    el.cutMode.addEventListener("change", () => {
      el.cutModeNote.textContent = el.cutMode.value === "precise"
        ? "精确模式会重新编码视频、音频和文字字幕，切割点准确，字幕时间会同步调整；长视频需要一些时间。"
        : "快速模式复制所有流，速度很快，但从最近关键帧开始，可能保留 1–2 秒广告；内封字幕保持原时间关系。";
      resetCutOutput();
      upsertCutDraft();
    });
    el.cutNewTask.addEventListener("click", clearCutTask);
    el.cutDeleteSelected.addEventListener("click", deleteSelectedCutTasks);
    el.cutRunSelected.addEventListener("click", runSelectedCutTasks);
    el.cutSelectAll.addEventListener("change", () => {
      selectedCutTasks.clear();
      if (el.cutSelectAll.checked) {
        el.cutTaskList.querySelectorAll(".task-rail-item").forEach((item) => {
          if (item.dataset.taskId) selectedCutTasks.add(item.dataset.taskId);
        });
      }
      refreshCutTasks();
    });
    el.cutStartBtn.addEventListener("click", startCut);
    el.tabCut.addEventListener("click", () => switchAppTab("cut"));
    updateCutSummary();
  }

  function muxLanguageTitle() {
    const option = el.muxLanguage.selectedOptions[0];
    return (option && (option.dataset.title || option.textContent.trim())) || "中文";
  }

  function muxDraftSettings() {
    return {
      language: el.muxLanguage.value,
      title: el.muxTitle.value.trim(),
      offset: el.muxOffset.value || "0",
      outputName: el.muxOutputName.value.trim(),
      default: el.muxDefault.checked,
    };
  }

  function upsertMuxDraft() {
    if (!muxState.videoFile && !muxState.subtitleFile) return;
    let task = muxDrafts.find((item) => item.id === muxState.draftId);
    if (!task && muxState.videoFile && muxState.subtitleFile) {
      task = muxDrafts.find((item) =>
        item.videoFile && item.subtitleFile
        && item.videoFile.name === muxState.videoFile.name
        && item.videoFile.size === muxState.videoFile.size
        && item.subtitleFile.name === muxState.subtitleFile.name
        && item.subtitleFile.size === muxState.subtitleFile.size
      );
      if (task) muxState.draftId = task.id;
    }
    if (!task) {
      muxDraftSeq += 1;
      muxState.draftId = `mux-draft-${muxDraftSeq}`;
      task = { id: muxState.draftId, status: "draft", created: Date.now() };
      muxDrafts.unshift(task);
    }
    task.name = (muxState.videoFile && muxState.videoFile.name)
      || (muxState.subtitleFile && muxState.subtitleFile.name)
      || "字幕内封任务";
    task.videoFile = muxState.videoFile;
    task.subtitleFile = muxState.subtitleFile;
    task.settings = muxDraftSettings();
    task.updated = Date.now();
    refreshMuxTasks();
  }

  async function loadMuxDraft(task) {
    if (!task) return;
    if (muxState.objectUrl) URL.revokeObjectURL(muxState.objectUrl);
    muxState.draftId = task.id;
    muxState.videoFile = task.videoFile || null;
    muxState.subtitleFile = task.subtitleFile || null;
    muxState.cues = [];
    muxState.objectUrl = null;
    muxState.pollToken = null;
    if (task.settings) {
      el.muxLanguage.value = task.settings.language || "chi";
      el.muxTitle.value = task.settings.title || muxLanguageTitle();
      el.muxOffset.value = task.settings.offset || "0";
      el.muxOutputName.value = task.settings.outputName || "";
      el.muxDefault.checked = task.settings.default !== false;
      muxState.titleAuto = false;
      muxState.outputNameAuto = false;
    }
    el.muxVideoName.textContent = task.videoFile ? task.videoFile.name : "未选择视频";
    el.muxSubName.textContent = task.subtitleFile ? task.subtitleFile.name : "未选择字幕";
    el.muxVideoInput.value = "";
    el.muxSubInput.value = "";
    el.muxDownload.hidden = true;
    el.muxProgress.hidden = true;
    el.muxOverlay.textContent = "";
    if (task.videoFile) {
      muxState.objectUrl = URL.createObjectURL(task.videoFile);
      el.muxVideo.src = muxState.objectUrl;
      el.muxVideo.load();
      el.muxEmpty.hidden = true;
    } else {
      el.muxVideo.removeAttribute("src");
      el.muxVideo.load();
      el.muxEmpty.hidden = false;
    }
    if (task.subtitleFile) {
      try {
        const text = await readSubtitleFile(task.subtitleFile);
        muxState.cues = parseSubtitleText(text, task.subtitleFile.name);
        updateMuxOverlay();
      } catch (_) {
        muxState.cues = [];
        el.muxOverlay.textContent = "";
      }
    }
    updateMuxSummary();
    el.muxStatus.textContent = muxState.videoFile && muxState.subtitleFile
      ? "任务已载入，可以开始封装。"
      : "继续选择视频或字幕。";
    el.muxStartBtn.disabled = !muxState.videoFile || !muxState.subtitleFile;
    refreshMuxTasks();
  }

  function initMux() {
    el.muxNewTask.addEventListener("click", clearMuxTask);
    el.muxDeleteSelected.addEventListener("click", deleteSelectedMuxTasks);
    el.muxRunSelected.addEventListener("click", runSelectedMuxTasks);
    el.muxSelectAll.addEventListener("change", () => {
      selectedMuxTasks.clear();
      if (el.muxSelectAll.checked) {
        el.muxTaskList.querySelectorAll(".task-rail-item").forEach((item) => {
          if (item.dataset.taskId && item.querySelector(".task-check")) selectedMuxTasks.add(item.dataset.taskId);
        });
      }
      refreshMuxTasks();
    });
    el.muxTitle.value = muxLanguageTitle();
    el.muxLanguage.addEventListener("change", () => {
      if (muxState.titleAuto) el.muxTitle.value = muxLanguageTitle();
      resetMuxOutput();
    });
    el.muxTitle.addEventListener("input", () => {
      muxState.titleAuto = !el.muxTitle.value.trim();
    });
    el.muxOutputName.addEventListener("input", () => {
      muxState.outputNameAuto = !el.muxOutputName.value.trim();
    });
    el.muxOffset.addEventListener("input", () => { resetMuxOutput(); upsertMuxDraft(); });
    [el.muxLanguage, el.muxTitle, el.muxOutputName, el.muxDefault].forEach((node) => {
      node.addEventListener("change", upsertMuxDraft);
      node.addEventListener("input", upsertMuxDraft);
    });
    $$('[data-mux-offset]').forEach((button) => {
      button.addEventListener("click", () => {
        const current = Number(el.muxOffset.value) || 0;
        const delta = Number(button.dataset.muxOffset) || 0;
        el.muxOffset.value = Math.max(-3600, Math.min(3600, current + delta)).toFixed(1);
        resetMuxOutput();
        upsertMuxDraft();
      });
    });
    el.muxVideoInput.addEventListener("change", () => {
      const file = el.muxVideoInput.files && el.muxVideoInput.files[0];
      if (!file) return;
      if (muxState.objectUrl) URL.revokeObjectURL(muxState.objectUrl);
      muxState.objectUrl = URL.createObjectURL(file);
      muxState.videoFile = file;
      el.muxVideo.src = muxState.objectUrl;
      el.muxVideo.load();
      el.muxEmpty.hidden = true;
      el.muxVideoName.textContent = file.name;
      el.muxVideoInput.value = "";
      const stem = file.name.replace(/\.[^.]+$/, "");
      el.muxOutputName.value = `${stem}.mkv`;
      muxState.outputNameAuto = true;
      updateMuxSummary();
      resetMuxOutput();
      upsertMuxDraft();
      toast("纯净视频已载入", "success");
    });
    el.muxSubInput.addEventListener("change", async () => {
      const file = el.muxSubInput.files && el.muxSubInput.files[0];
      if (!file) return;
      muxState.subtitleFile = file;
      muxState.cues = [];
      el.muxSubName.textContent = file.name;
      el.muxSubInput.value = "";
      try {
        const text = await readSubtitleFile(file);
        muxState.cues = parseSubtitleText(text, file.name);
        updateMuxOverlay();
        toast(`字幕已载入${muxState.cues.length ? `，共 ${muxState.cues.length} 条` : ""}`, "success");
      } catch (error) {
        el.muxOverlay.textContent = "";
        toast("字幕已载入，但无法在预览中解析；封装仍可继续", "error");
      }
      updateMuxSummary();
      resetMuxOutput();
      upsertMuxDraft();
    });
    el.muxStartBtn.addEventListener("click", muxVideo);
    el.muxVideo.addEventListener("timeupdate", updateMuxOverlay);
    el.muxVideo.addEventListener("seeked", updateMuxOverlay);
    el.muxVideo.addEventListener("loadedmetadata", updateMuxOverlay);
    el.tabMux.addEventListener("click", () => switchAppTab("mux"));
    updateMuxSummary();
    resetMuxOutput();
  }

  function initTranslate() {
    el.translateNewTask.addEventListener("click", clearTranslateTask);
    el.translateDeleteSelected.addEventListener("click", deleteSelectedTranslateTasks);
    el.translateRunSelected.addEventListener("click", runSelectedTranslateTasks);
    el.translateSelectAll.addEventListener("change", () => {
      selectedTranslateTasks.clear();
      if (el.translateSelectAll.checked) {
        el.translateTaskList.querySelectorAll(".task-rail-item").forEach((item) => {
          if (item.dataset.taskId) selectedTranslateTasks.add(item.dataset.taskId);
        });
      }
      refreshTranslateTasks();
    });
    [el.translateSource, el.translateTarget, el.translateBilingual].forEach((node) => {
      node.addEventListener("change", upsertTranslateDraft);
    });
    el.tabTranslate.addEventListener("click", () => switchAppTab("translate"));
    const choose = (file) => {
      if (!file) return;
      const suffix = (file.name.split(".").pop() || "").toLowerCase();
      if (!["srt", "ass", "ssa"].includes(suffix)) {
        toast("只支持 SRT、ASS 或 SSA 字幕文件", "error");
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        toast("字幕文件不能超过 8 MB", "error");
        return;
      }
      state.translateFile = file;
      el.translateFileName.textContent = file.name;
      el.translateOutputFormat.textContent = suffix.toUpperCase();
      el.translateStartBtn.disabled = false;
      el.translateStatus.textContent = "准备翻译，选择语言后开始。";
      el.translateDownload.hidden = true;
      el.translatePreview.innerHTML = '<p class="translate-empty">翻译完成后会在这里显示前几条结果。</p>';
      el.translatePreviewCount.textContent = "0 条";
      upsertTranslateDraft();
    };
    el.translateFileInput.addEventListener("change", () => choose(el.translateFileInput.files[0]));
    ["dragenter", "dragover"].forEach((name) => el.translateDrop.addEventListener(name, (event) => {
      event.preventDefault();
      el.translateDrop.classList.add("is-dragging");
    }));
    ["dragleave", "drop"].forEach((name) => el.translateDrop.addEventListener(name, (event) => {
      event.preventDefault();
      el.translateDrop.classList.remove("is-dragging");
    }));
    el.translateDrop.addEventListener("drop", (event) => {
      const file = event.dataTransfer.files && event.dataTransfer.files[0];
      if (file) choose(file);
    });
    el.translateStartBtn.addEventListener("click", startTranslation);
    el.translateDownload.addEventListener("click", () => {
      if (state.translateTimer) clearInterval(state.translateTimer);
      state.translateTimer = null;
    });
  }

  async function startTranslation() {
    if (!state.translateFile) {
      toast("请先选择字幕文件", "error");
      return;
    }
    if (el.translateStartBtn.disabled) return;
    const form = new FormData();
    form.append("subtitle", state.translateFile, state.translateFile.name);
    form.append("source", el.translateSource.value);
    form.append("target", el.translateTarget.value);
    form.append("bilingual", el.translateBilingual.checked ? "1" : "0");
    el.translateStartBtn.disabled = true;
    el.translateStartBtn.querySelector("span").textContent = "翻译中…";
    el.translateProgress.hidden = false;
    el.translateProgressBar.style.width = "2%";
    el.translateProgressPct.textContent = "0%";
    el.translateProgressLabel.textContent = "上传字幕…";
    el.translateStatus.textContent = "正在上传字幕…";
    el.translateDownload.hidden = true;
    try {
      const response = await fetch("/api/translate", { method: "POST", body: form });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error((data && data.error) || "无法开始翻译");
      const draftIndex = translateDrafts.findIndex((item) => item.id === state.translateDraftId);
      if (draftIndex >= 0) translateDrafts.splice(draftIndex, 1);
      state.translateDraftId = null;
      state.translateToken = data.token;
      pollTranslation(data.token);
    } catch (error) {
      toast(error.message || "翻译失败", "error");
      resetTranslateButton();
      el.translateStatus.textContent = error.message || "翻译失败";
    }
  }

  function pollTranslation(token) {
    if (state.translateTimer) clearInterval(state.translateTimer);
    const tick = async () => {
      try {
        const data = await api(`/api/translate/${token}`);
        const pct = Math.round((Number(data.progress) || 0) * 100);
        el.translateProgressBar.style.width = `${pct}%`;
        el.translateProgressPct.textContent = `${pct}%`;
        el.translateProgressLabel.textContent = data.message || "翻译中…";
        el.translateStatus.textContent = data.message || "翻译中…";
        if (data.status === "done") {
          clearInterval(state.translateTimer);
          state.translateTimer = null;
          el.translateProgressBar.style.width = "100%";
          el.translateProgressPct.textContent = "100%";
          el.translatePreviewCount.textContent = `${data.entries} 条`;
          renderTranslationPreview(data.preview || []);
          el.translateDownload.href = data.download;
          el.translateDownload.hidden = false;
          el.translateDownload.textContent = "下载翻译字幕";
          el.translateStatus.textContent = "翻译完成。时间轴和格式已保留。";
          resetTranslateButton();
          refreshTranslateTasks();
        } else if (data.status === "error") {
          clearInterval(state.translateTimer);
          state.translateTimer = null;
          toast(data.error || "翻译失败", "error");
          el.translateStatus.textContent = data.error || "翻译失败";
          resetTranslateButton();
        }
      } catch (error) {
        clearInterval(state.translateTimer);
        state.translateTimer = null;
        toast(error.message || "无法获取翻译进度", "error");
        el.translateStatus.textContent = error.message || "无法获取翻译进度";
        resetTranslateButton();
      }
    };
    tick();
    state.translateTimer = setInterval(tick, 900);
  }

  function renderTranslationPreview(items) {
    el.translatePreview.innerHTML = "";
    if (!items.length) {
      el.translatePreview.innerHTML = '<p class="translate-empty">没有可显示的结果。</p>';
      return;
    }
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "translate-preview-row";
      const time = document.createElement("span");
      time.className = "translate-preview-time";
      time.textContent = item.time || "";
      const body = document.createElement("div");
      body.className = "translate-preview-body";
      const source = document.createElement("p");
      source.className = "translate-preview-source";
      source.textContent = item.source || "";
      const target = document.createElement("p");
      target.className = "translate-preview-target";
      target.textContent = item.target || "";
      body.append(source, target);
      row.append(time, body);
      el.translatePreview.append(row);
    });
  }

  function resetTranslateButton() {
    el.translateStartBtn.disabled = !state.translateFile;
    el.translateStartBtn.querySelector("span").textContent = "开始翻译";
  }

  function switchAppTab(tab) {
    const sync = tab === "sync";
    const mux = tab === "mux";
    const cut = tab === "cut";
    const translate = tab === "translate";
    el.tabExtract.classList.toggle("is-active", !sync && !mux && !cut && !translate);
    el.tabSync.classList.toggle("is-active", sync);
    el.tabMux.classList.toggle("is-active", mux);
    el.tabCut.classList.toggle("is-active", cut);
    el.tabTranslate.classList.toggle("is-active", translate);
    el.syncView.hidden = !sync;
    el.muxView.hidden = !mux;
    el.cutView.hidden = !cut;
    el.translateView.hidden = !translate;
    refreshTaskRails();
    el.landing.hidden = true;
    el.workspace.hidden = sync || mux || cut || translate;
    if (sync) {
      el.video.pause();
      el.muxVideo.pause();
      el.cutVideo.pause();
      loadSyncSources();
      window.scrollTo({ top: 0, behavior: "auto" });
    } else if (mux) {
      el.video.pause();
      el.syncVideo.pause();
      el.cutVideo.pause();
      window.scrollTo({ top: 0, behavior: "auto" });
    } else if (cut) {
      el.video.pause();
      el.syncVideo.pause();
      el.muxVideo.pause();
      window.scrollTo({ top: 0, behavior: "auto" });
    } else if (translate) {
      el.video.pause();
      el.syncVideo.pause();
      el.muxVideo.pause();
      el.cutVideo.pause();
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      el.syncVideo.pause();
      el.muxVideo.pause();
      el.cutVideo.pause();
    }
  }

  // ---------------------------------------------------------------- misc events
  const TASK_STATUS_LABELS = {
    ready: "待识别", processing: "识别中", done: "已完成", error: "失败", cancelled: "已取消",
    queued: "排队中", muxing: "封装中", cutting: "切割中", running: "翻译中", draft: "待封装",
  };

  function renderTaskRail(container, tasks, activeToken, onSelect, options = {}) {
    if (!container) return;
    container.replaceChildren();
    if (!tasks.length) {
      const empty = document.createElement("p");
      empty.className = "task-rail-empty";
      empty.textContent = "暂无任务";
      container.append(empty);
      return;
    }
    tasks.forEach((task) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "task-rail-item";
      const taskKey = task.id || task.token;
      button.dataset.taskId = taskKey;
      if (taskKey === activeToken) button.classList.add("is-active");
      if (options.selectable && (!options.selectableFor || options.selectableFor(task))) {
        const selected = options.selected && options.selected.has(taskKey);
        if (selected) button.classList.add("is-selected");
        const check = document.createElement("input");
        check.type = "checkbox";
        check.className = "task-check";
        check.checked = selected;
        check.addEventListener("click", (event) => event.stopPropagation());
        check.addEventListener("change", () => options.onToggle && options.onToggle(taskKey, check.checked));
        button.append(check);
      }
      if (["done"].includes(task.status)) button.classList.add("is-done");
      if (["error", "cancelled"].includes(task.status)) button.classList.add("is-error");
      const name = document.createElement("b");
      name.textContent = task.name || task.filename || `任务 ${String(task.id || task.token).slice(0, 6)}`;
      const meta = document.createElement("small");
      const status = document.createElement("span");
      status.textContent = task.statusLabel || TASK_STATUS_LABELS[task.status] || task.status || "任务";
      const extra = document.createElement("span");
      const progress = Math.round((Number(task.progress) || 0) * 100);
      extra.textContent = task.status === "done"
        ? (task.saved_path ? "已保存" : "完成")
        : (progress > 0 ? `${progress}%` : "");
      meta.append(status, extra);
      button.append(name, meta);
      button.addEventListener("click", () => onSelect(task));
      container.append(button);
    });
  }

  async function refreshExtractTasks() {
    if (el.workspace.hidden) return;
    try {
      const data = await api("/api/jobs");
      const jobs = data.jobs || [];
      const valid = new Set(jobs.map((job) => job.id));
      state.selectedExtractTasks.forEach((id) => { if (!valid.has(id)) state.selectedExtractTasks.delete(id); });
      renderTaskRail(el.extractTaskList, jobs, state.job && state.job.id, (task) => {
        if (state.dirty && !window.confirm("有未保存的字幕修改，确定切换任务吗？")) return;
        openJob(task.id);
      }, {
        selectable: true,
        selected: state.selectedExtractTasks,
        onToggle: (id, checked) => {
          if (checked) state.selectedExtractTasks.add(id);
          else state.selectedExtractTasks.delete(id);
          updateExtractSelection();
        },
      });
      updateExtractSelection();
    } catch (_) {}
  }

  async function refreshMuxTasks() {
    if (el.muxView.hidden) return;
    try {
      const data = await api("/api/mux/tasks");
      const tasks = [...muxDrafts, ...(data.tasks || [])];
      const valid = new Set(tasks.map((task) => task.id || task.token));
      selectedMuxTasks.forEach((id) => { if (!valid.has(id)) selectedMuxTasks.delete(id); });
      renderTaskRail(el.muxTaskList, tasks, muxState.pollToken || muxState.draftId, (task) => {
        if (String(task.id || "").startsWith("mux-draft-")) {
          loadMuxDraft(task);
          return;
        }
        muxState.pollToken = task.token;
        pollMuxStatus(task.token);
      }, {
        selectable: true,
        selected: selectedMuxTasks,
        onToggle: (id, checked) => {
          if (checked) selectedMuxTasks.add(id);
          else selectedMuxTasks.delete(id);
          updateMuxSelection();
        },
      });
      updateMuxSelection();
    } catch (_) {}
  }

  async function refreshCutTasks() {
    if (el.cutView.hidden) return;
    try {
      const data = await api("/api/cut/tasks");
      const tasks = [...cutDrafts, ...(data.tasks || [])];
      const valid = new Set(tasks.map((task) => task.id || task.token));
      selectedCutTasks.forEach((id) => { if (!valid.has(id)) selectedCutTasks.delete(id); });
      renderTaskRail(el.cutTaskList, tasks, cutState.pollToken || cutState.draftId, (task) => {
        if (String(task.id || "").startsWith("cut-draft-")) {
          loadCutDraft(task);
          return;
        }
        cutState.pollToken = task.token;
        pollCutStatus(task.token);
      }, {
        selectable: true,
        selected: selectedCutTasks,
        onToggle: (id, checked) => {
          if (checked) selectedCutTasks.add(id);
          else selectedCutTasks.delete(id);
          updateCutSelection();
        },
      });
      updateCutSelection();
    } catch (_) {}
  }

  function translateDraftSettings() {
    return {
      source: el.translateSource.value,
      target: el.translateTarget.value,
      bilingual: el.translateBilingual.checked,
    };
  }

  function upsertTranslateDraft() {
    if (!state.translateFile) return;
    let task = translateDrafts.find((item) => item.id === state.translateDraftId);
    if (!task) {
      const duplicate = translateDrafts.find((item) =>
        item.subtitleFile && item.subtitleFile.name === state.translateFile.name
        && item.subtitleFile.size === state.translateFile.size
        && item.settings.source === el.translateSource.value
        && item.settings.target === el.translateTarget.value
        && item.settings.bilingual === el.translateBilingual.checked
      );
      if (duplicate) {
        state.translateDraftId = duplicate.id;
        task = duplicate;
      } else {
        translateDraftSeq += 1;
        state.translateDraftId = `translate-draft-${translateDraftSeq}`;
        task = { id: state.translateDraftId, status: "draft", created: Date.now() };
        translateDrafts.unshift(task);
      }
    }
    task.name = state.translateFile.name;
    task.subtitleFile = state.translateFile;
    task.settings = translateDraftSettings();
    refreshTranslateTasks();
  }

  function loadTranslateDraft(task) {
    if (!task) return;
    state.translateDraftId = task.id;
    state.translateFile = task.subtitleFile || null;
    el.translateFileName.textContent = task.subtitleFile ? task.subtitleFile.name : "或拖到这里";
    el.translateSource.value = (task.settings && task.settings.source) || "auto";
    el.translateTarget.value = (task.settings && task.settings.target) || "zh-Hant";
    el.translateBilingual.checked = !!(task.settings && task.settings.bilingual);
    el.translateStartBtn.disabled = !state.translateFile;
    el.translateDownload.hidden = true;
    el.translateProgress.hidden = true;
    refreshTranslateTasks();
  }

  function updateTranslateSelection() {
    const count = selectedTranslateTasks.size;
    const draftCount = translateDrafts.filter((task) => selectedTranslateTasks.has(task.id)).length;
    el.translateRunSelected.disabled = draftCount === 0 || translateBatchBusy;
    el.translateDeleteSelected.disabled = count === 0 || translateBatchBusy;
    el.translateRunSelected.textContent = draftCount ? `执行选中 (${draftCount})` : "执行选中";
    el.translateDeleteSelected.textContent = count ? `删除选中 (${count})` : "删除选中";
    const total = el.translateTaskList.querySelectorAll(".task-check").length;
    el.translateSelectAll.checked = total > 0 && count === total;
    el.translateSelectAll.indeterminate = count > 0 && count < total;
  }

  async function deleteSelectedTranslateTasks() {
    const ids = [...selectedTranslateTasks];
    if (!ids.length) return;
    if (!window.confirm(`删除选中的 ${ids.length} 个翻译任务？`)) return;
    translateBatchBusy = true;
    for (const id of ids) {
      if (String(id).startsWith("translate-draft-")) {
        const index = translateDrafts.findIndex((task) => task.id === id);
        if (index >= 0) translateDrafts.splice(index, 1);
      } else {
        try { await api(`/api/translate/tasks/${id}`, { method: "DELETE" }); } catch (_) {}
      }
    }
    if (ids.includes(state.translateDraftId)) clearTranslateTask();
    selectedTranslateTasks.clear();
    translateBatchBusy = false;
    refreshTranslateTasks();
  }

  async function runSelectedTranslateTasks() {
    if (translateBatchBusy) return;
    const drafts = translateDrafts.filter((task) => selectedTranslateTasks.has(task.id));
    if (!drafts.length) {
      toast("请选择待翻译任务；已完成任务不能直接重跑", "error");
      return;
    }
    translateBatchBusy = true;
    updateTranslateSelection();
    let submitted = 0;
    for (const task of drafts) {
      if (!task.subtitleFile) continue;
      const form = new FormData();
      form.append("subtitle", task.subtitleFile, task.subtitleFile.name);
      form.append("source", (task.settings && task.settings.source) || "auto");
      form.append("target", (task.settings && task.settings.target) || "zh-Hant");
      form.append("bilingual", task.settings && task.settings.bilingual ? "1" : "0");
      try {
        const response = await fetch("/api/translate", { method: "POST", body: form });
        const data = await response.json().catch(() => null);
        if (!response.ok || !data || !data.token) throw new Error("提交失败");
        const index = translateDrafts.findIndex((item) => item.id === task.id);
        if (index >= 0) translateDrafts.splice(index, 1);
        submitted += 1;
      } catch (_) {}
    }
    selectedTranslateTasks.clear();
    translateBatchBusy = false;
    refreshTranslateTasks();
    toast(submitted ? `已提交 ${submitted} 个翻译任务` : "任务提交失败", submitted ? "success" : "error");
  }

  async function refreshTranslateTasks() {
    if (el.translateView.hidden) return;
    try {
      const data = await api("/api/translate/tasks");
      const tasks = [...translateDrafts, ...(data.tasks || [])];
      const valid = new Set(tasks.map((task) => task.id || task.token));
      selectedTranslateTasks.forEach((id) => { if (!valid.has(id)) selectedTranslateTasks.delete(id); });
      renderTaskRail(el.translateTaskList, tasks, state.translateToken || state.translateDraftId, (task) => {
        if (String(task.id || "").startsWith("translate-draft-")) {
          loadTranslateDraft(task);
          return;
        }
        state.translateToken = task.token;
        pollTranslation(task.token);
      }, {
        selectable: true,
        selected: selectedTranslateTasks,
        onToggle: (id, checked) => {
          if (checked) selectedTranslateTasks.add(id);
          else selectedTranslateTasks.delete(id);
          updateTranslateSelection();
        },
      });
      updateTranslateSelection();
    } catch (_) {}
  }

  function snapshotSyncTask() {
    if (!syncState.videoName && !syncState.subtitleName && !syncState.cues.length) return;
    const task = {
      id: syncState.taskId,
      name: syncState.videoName || syncState.subtitleName || "同步任务",
      videoName: syncState.videoName,
      subtitleName: syncState.subtitleName,
      cues: syncState.cues,
      offset: syncState.offset,
      anchors: syncState.anchors,
      selectedId: syncState.selectedId,
      videoFile: syncState.videoFile,
      videoUrl: syncState.videoUrl,
      compatUrl: syncState.compatUrl,
      auto: syncState.auto,
      pendingAuto: syncState.pendingAuto,
      status: syncState.cues.length ? "ready" : "queued",
      statusLabel: syncState.cues.length ? "已载入" : "待载入",
    };
    const index = syncTasks.findIndex((item) => item.id === task.id);
    if (index >= 0) syncTasks[index] = task;
    else syncTasks.unshift(task);
  }

  function refreshSyncTasks() {
    if (el.syncView.hidden) return;
    const tasks = syncTasks.slice();
    if (syncState.videoName || syncState.subtitleName || syncState.cues.length) {
      const current = {
        id: syncState.taskId,
        name: syncState.videoName || syncState.subtitleName || "当前同步任务",
        status: syncState.cues.length ? "ready" : "queued",
        statusLabel: syncState.cues.length ? "已载入" : "待载入",
      };
      const index = tasks.findIndex((item) => item.id === current.id);
      if (index >= 0) tasks[index] = { ...tasks[index], ...current };
      else tasks.unshift(current);
    }
    const valid = new Set(tasks.map((task) => task.id));
    selectedSyncTasks.forEach((id) => { if (!valid.has(id)) selectedSyncTasks.delete(id); });
    renderTaskRail(el.syncTaskList, tasks, syncState.taskId, (task) => selectSyncTask(task), {
      selectable: true,
      selected: selectedSyncTasks,
      onToggle: (id, checked) => {
        if (checked) selectedSyncTasks.add(id);
        else selectedSyncTasks.delete(id);
        updateSyncSelection();
      },
    });
    updateSyncSelection();
  }

  function updateSyncSelection() {
    const count = selectedSyncTasks.size;
    el.syncDeleteSelected.disabled = count === 0;
    el.syncRunSelected.disabled = count === 0;
    el.syncDeleteSelected.textContent = count ? `删除选中 (${count})` : "删除选中";
    el.syncRunSelected.textContent = count ? `导出选中 (${count})` : "导出选中";
    const total = el.syncTaskList.querySelectorAll(".task-check").length;
    el.syncSelectAll.checked = total > 0 && count === total;
    el.syncSelectAll.indeterminate = count > 0 && count < total;
  }

  function syncSrtForTask(task) {
    const backup = { ...syncState };
    if (task.id === syncState.taskId) snapshotSyncTask();
    const stored = syncTasks.find((item) => item.id === task.id) || task;
    Object.assign(syncState, {
      cues: stored.cues || [],
      offset: Number(stored.offset) || 0,
      anchors: (stored.anchors || []).slice(),
      auto: stored.auto || null,
      selectedId: stored.selectedId || null,
    });
    const adjusted = adjustedSyncCues();
    Object.assign(syncState, backup);
    return adjusted;
  }

  function downloadSyncSrt(task) {
    const cues = syncSrtForTask(task);
    if (!cues.length) return false;
    const blocks = cues.map((cue, index) => (
      `${index + 1}\n${fmtCueTime(cue.adjustedStart).replace(".", ",")} --> ${fmtCueTime(cue.adjustedEnd).replace(".", ",")}\n${cue.text}\n`
    ));
    const blob = new Blob([blocks.join("\n")], { type: "application/x-subrip" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${(task.videoName || task.subtitleName || "subtitle").replace(/\.[^.]+$/, "")}_synced.srt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  }

  function deleteSelectedSyncTasks() {
    const ids = [...selectedSyncTasks];
    if (!ids.length) return;
    if (!window.confirm(`删除选中的 ${ids.length} 个同步任务？`)) return;
    const deletingCurrent = ids.includes(syncState.taskId);
    for (const id of ids) {
      const index = syncTasks.findIndex((task) => task.id === id);
      if (index >= 0) syncTasks.splice(index, 1);
    }
    selectedSyncTasks.clear();
    if (deletingCurrent) clearSyncTask(false);
    refreshSyncTasks();
  }

  function exportSelectedSyncTasks() {
    const tasks = syncTasks.filter((task) => selectedSyncTasks.has(task.id));
    let count = 0;
    tasks.forEach((task) => { if (downloadSyncSrt(task)) count += 1; });
    toast(count ? `已导出 ${count} 个同步字幕` : "没有可导出的字幕", count ? "success" : "error");
  }

  function selectSyncTask(task) {
    if (!task || task.id === syncState.taskId) return;
    snapshotSyncTask();
    syncState.taskId = task.id;
    syncState.videoName = task.videoName || "";
    syncState.subtitleName = task.subtitleName || "";
    syncState.cues = task.cues || [];
    syncState.offset = Number(task.offset) || 0;
    syncState.anchors = (task.anchors || []).slice();
    syncState.selectedId = task.selectedId || null;
    syncState.videoFile = task.videoFile || null;
    syncState.videoUrl = task.videoUrl || null;
    syncState.compatUrl = task.compatUrl || null;
    syncState.auto = task.auto || null;
    syncState.pendingAuto = task.pendingAuto || null;
    el.syncVideoName.textContent = syncState.videoName || "未选择视频";
    el.syncSubName.textContent = syncState.subtitleName || "未选择字幕";
    el.syncOffset.value = syncState.offset.toFixed(2);
    el.syncEmpty.hidden = !!syncState.videoUrl;
    if (syncState.videoUrl) {
      el.syncVideo.src = syncState.compatUrl || syncState.videoUrl;
      el.syncVideo.load();
    } else {
      el.syncVideo.removeAttribute("src");
      el.syncVideo.load();
    }
    renderSyncAnchors();
    renderSyncCueList();
    updateSyncOverlay();
    renderSyncAuto();
    refreshSyncTasks();
  }

  function updateExtractSelection() {
    const count = state.selectedExtractTasks.size;
    el.extractRunSelected.disabled = count === 0;
    el.extractDeleteSelected.disabled = count === 0;
    el.extractRunSelected.textContent = count ? `执行选中 (${count})` : "执行选中";
    el.extractDeleteSelected.textContent = count ? `删除选中 (${count})` : "删除选中";
    const jobs = el.extractTaskList.querySelectorAll(".task-rail-item").length;
    el.extractSelectAll.checked = jobs > 0 && count === jobs;
    el.extractSelectAll.indeterminate = count > 0 && count < jobs;
  }

  async function runSelectedExtractions() {
    const ids = [...state.selectedExtractTasks];
    if (!ids.length) return;
    el.extractRunSelected.disabled = true;
    try {
      const result = await api("/api/jobs/batch-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const started = (result.started || []).length;
      toast(`已启动 ${started} 个识别任务`, "success");
      state.selectedExtractTasks.clear();
      await refreshExtractTasks();
      if (state.job && ids.includes(state.job.id)) openJob(state.job.id);
    } catch (error) {
      toast(error.message || "批量执行失败", "error");
    } finally {
      updateExtractSelection();
    }
  }

  async function deleteSelectedExtractions() {
    const ids = [...state.selectedExtractTasks];
    if (!ids.length) return;
    if (!window.confirm(`删除选中的 ${ids.length} 个任务？任务视频和本地缓存会一并删除，操作不可撤销。`)) return;
    el.extractDeleteSelected.disabled = true;
    const deletingCurrent = !!(state.job && ids.includes(state.job.id));
    let deleted = 0;
    let failed = 0;
    for (const id of ids) {
      try {
        await api(`/api/jobs/${id}`, { method: "DELETE" });
        deleted += 1;
      } catch (_) {
        failed += 1;
      }
    }
    state.selectedExtractTasks.clear();
    if (deletingCurrent) showLanding();
    await refreshExtractTasks();
    updateExtractSelection();
    if (failed) toast(`已删除 ${deleted} 个，${failed} 个未能删除（运行中的任务需先取消）`, "error");
    else toast(`已删除 ${deleted} 个任务`, "success");
  }

  async function saveCurrentSettings() {
    if (!state.job) return;
    try {
      const settings = readSettings();
      await api(`/api/jobs/${state.job.id}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      state.job.settings = settings;
      toast("任务设置已保存", "success");
    } catch (error) {
      toast(error.message || "保存设置失败", "error");
    }
  }

  function updateMuxSelection() {
    const count = selectedMuxTasks.size;
    const draftCount = muxDrafts.filter((task) => selectedMuxTasks.has(task.id)).length;
    el.muxRunSelected.disabled = draftCount === 0 || muxBatchBusy;
    el.muxDeleteSelected.disabled = count === 0 || muxBatchBusy;
    el.muxRunSelected.textContent = draftCount ? `执行选中 (${draftCount})` : "执行选中";
    el.muxDeleteSelected.textContent = count ? `删除选中 (${count})` : "删除选中";
    const total = el.muxTaskList.querySelectorAll(".task-check").length;
    el.muxSelectAll.checked = total > 0 && count === total;
    el.muxSelectAll.indeterminate = count > 0 && count < total;
  }

  async function deleteSelectedMuxTasks() {
    const ids = [...selectedMuxTasks];
    if (!ids.length) return;
    if (!window.confirm(`删除选中的 ${ids.length} 个字幕内封任务？`)) return;
    el.muxDeleteSelected.disabled = true;
    for (const id of ids) {
      if (String(id).startsWith("mux-draft-")) {
        const index = muxDrafts.findIndex((task) => task.id === id);
        if (index >= 0) muxDrafts.splice(index, 1);
      } else {
        try { await api(`/api/mux/tasks/${id}`, { method: "DELETE" }); } catch (_) {}
      }
    }
    if (ids.includes(muxState.draftId)) {
      clearMuxTask();
    }
    selectedMuxTasks.clear();
    refreshMuxTasks();
    toast("已删除选中任务", "success");
  }

  async function runSelectedMuxTasks() {
    if (muxBatchBusy) return;
    const drafts = muxDrafts.filter((task) => selectedMuxTasks.has(task.id));
    if (!drafts.length) {
      toast("请选择待封装任务；已完成任务不能直接重跑", "error");
      return;
    }
    muxBatchBusy = true;
    updateMuxSelection();
    let submitted = 0;
    for (const task of drafts) {
      if (!task.videoFile || !task.subtitleFile) continue;
      const form = new FormData();
      form.append("video", task.videoFile, task.videoFile.name);
      form.append("subtitle", task.subtitleFile, task.subtitleFile.name);
      form.append("language", task.settings.language || "chi");
      form.append("title", task.settings.title || "");
      form.append("offset", task.settings.offset || "0");
      form.append("output_name", task.settings.outputName || "");
      form.append("default", task.settings.default ? "1" : "0");
      try {
        const response = await fetch("/api/mux", { method: "POST", body: form });
        const data = await response.json().catch(() => null);
        if (!response.ok || !data || !data.token) throw new Error((data && data.error) || "提交失败");
        const index = muxDrafts.findIndex((item) => item.id === task.id);
        if (index >= 0) muxDrafts.splice(index, 1);
        submitted += 1;
      } catch (_) {}
    }
    selectedMuxTasks.clear();
    muxBatchBusy = false;
    refreshMuxTasks();
    toast(submitted ? `已提交 ${submitted} 个字幕内封任务` : "任务提交失败", submitted ? "success" : "error");
  }

  function refreshTaskRails() {
    refreshExtractTasks();
    refreshMuxTasks();
    refreshCutTasks();
    refreshTranslateTasks();
    refreshSyncTasks();
  }

  function clearSyncTask(save = true) {
    if (save) snapshotSyncTask();
    el.syncVideo.pause();
    syncTaskSeq += 1;
    syncState.taskId = `sync-${syncTaskSeq}`;
    syncState.videoUrl = null;
    syncState.compatUrl = null;
    syncState.videoFile = null;
    syncState.videoName = "";
    syncState.subtitleName = "";
    syncState.cues = [];
    syncState.offset = 0;
    syncState.anchors = [];
    syncState.selectedId = null;
    syncState.auto = null;
    syncState.pendingAuto = null;
    el.syncVideo.removeAttribute("src");
    el.syncVideo.load();
    el.syncEmpty.hidden = false;
    el.syncVideoName.textContent = "未选择视频";
    el.syncSubName.textContent = "未选择字幕";
    el.syncVideoInput.value = "";
    el.syncSubInput.value = "";
    el.syncOffset.value = "0.00";
    el.syncOverlay.textContent = "";
    el.syncCueList.innerHTML = '<div class="sync-list-empty">载入字幕文件后，这里会显示原始时间与调整后的时间。</div>';
    el.syncCueCount.textContent = "0 条";
    renderSyncAnchors();
    renderSyncAuto();
    refreshSyncTasks();
  }

  function clearMuxTask() {
    stopMuxPolling();
    if (muxState.objectUrl) URL.revokeObjectURL(muxState.objectUrl);
    muxState.objectUrl = null;
    muxState.videoFile = null;
    muxState.subtitleFile = null;
    muxState.cues = [];
    muxState.pollToken = null;
    muxState.draftId = null;
    el.muxVideo.removeAttribute("src");
    el.muxVideo.load();
    el.muxEmpty.hidden = false;
    el.muxVideoName.textContent = "未选择视频";
    el.muxSubName.textContent = "未选择字幕";
    el.muxVideoInput.value = "";
    el.muxSubInput.value = "";
    el.muxOutputName.value = "";
    el.muxOffset.value = "0";
    el.muxDownload.hidden = true;
    el.muxProgress.hidden = true;
    el.muxOverlay.textContent = "";
    el.muxStatus.textContent = "选择视频和字幕后即可封装。";
    el.muxStartBtn.disabled = true;
    el.muxStartBtn.textContent = "开始封装";
    refreshMuxTasks();
  }

  function clearCutTask() {
    if (cutState.pollTimer) clearTimeout(cutState.pollTimer);
    cutState.pollTimer = null;
    cutState.pollToken = null;
    if (cutState.objectUrl) URL.revokeObjectURL(cutState.objectUrl);
    cutState.objectUrl = null;
    cutState.videoFile = null;
    cutState.draftId = null;
    cutState.duration = 0;
    el.cutVideo.removeAttribute("src");
    el.cutVideo.load();
    el.cutEmpty.hidden = false;
    el.cutVideoName.textContent = "未选择视频";
    el.cutVideoInput.value = "";
    el.cutStart.value = "00:00:00.000";
    el.cutEnd.value = "00:00:00.000";
    el.cutSummary.textContent = "选择视频后设置开始和结束时间。";
    el.cutStatus.textContent = "选择视频后设置切割范围。";
    el.cutDownload.hidden = true;
    el.cutProgress.hidden = true;
    el.cutStartBtn.disabled = true;
    el.cutStartBtn.textContent = "开始切割";
    refreshCutTasks();
  }

  function clearTranslateTask() {
    if (state.translateTimer) clearInterval(state.translateTimer);
    state.translateTimer = null;
    state.translateToken = null;
    state.translateDraftId = null;
    state.translateFile = null;
    el.translateFileInput.value = "";
    el.translateFileName.textContent = "或拖到这里";
    el.translateStartBtn.disabled = true;
    el.translateProgress.hidden = true;
    el.translateDownload.hidden = true;
    el.translatePreviewCount.textContent = "0 条";
    el.translatePreview.innerHTML = '<p class="translate-empty">翻译完成后会在这里显示前几条结果。</p>';
    el.translateStatus.textContent = "选择字幕后开始翻译。";
    refreshTranslateTasks();
  }

  function initFileDrops() {
    const videoExt = /\.(mp4|mkv|mov|avi|webm|m4v|ts|flv|wmv|mpg|mpeg)$/i;
    const subtitleExt = /\.(srt|ass|ssa)$/i;
    const setInput = (input, file) => {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      input.files = transfer.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    };
    const configs = [
      [el.videoStage, el.fileInput, null, "松开以载入视频"],
      [el.syncStage, el.syncVideoInput, el.syncSubInput, "松开以载入视频或字幕"],
      [el.muxVideo.closest(".mux-stage"), el.muxVideoInput, el.muxSubInput, "松开以载入视频或字幕"],
      [el.cutVideo.closest(".cut-stage"), el.cutVideoInput, null, "松开以载入视频"],
    ];
    configs.forEach(([stage, videoInput, subtitleInput, hintText]) => {
      if (!stage || !videoInput) return;
      const hint = document.createElement("div");
      hint.className = "stage-drop-hint";
      hint.textContent = hintText;
      stage.append(hint);
      stage.addEventListener("dragenter", (event) => {
        event.preventDefault();
        stage.classList.add("is-dragging");
      });
      stage.addEventListener("dragover", (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      });
      stage.addEventListener("dragleave", (event) => {
        if (!stage.contains(event.relatedTarget)) stage.classList.remove("is-dragging");
      });
      stage.addEventListener("drop", (event) => {
        event.preventDefault();
        event.stopPropagation();
        stage.classList.remove("is-dragging");
        const files = Array.from(event.dataTransfer.files || []);
        const video = files.find((file) => videoExt.test(file.name));
        const subtitle = files.find((file) => subtitleExt.test(file.name));
        if (video) setInput(videoInput, video);
        if (subtitle && subtitleInput) {
          setInput(subtitleInput, subtitle);
        } else if (subtitle) {
          toast("当前页面只需要视频文件", "error");
        }
        if (!video && !(subtitle && subtitleInput)) {
          toast("请拖入视频文件或 SRT/ASS/SSA 字幕", "error");
        }
      });
    });
  }

  function initToolPlayers() {
    [
      [el.syncVideo, el.syncPlayBtn, el.syncTimeline, el.syncTimeLabel],
      [el.muxVideo, el.muxPlayBtn, el.muxTimeline, el.muxTimeLabel],
      [el.cutVideo, el.cutPlayBtn, el.cutTimeline, el.cutTimeLabel],
    ].forEach(([video, playBtn, timeline, timeLabel]) => {
      if (!video || !playBtn || !timeline || !timeLabel) return;
      const update = () => {
        const duration = Number(video.duration) || 0;
        const current = Number(video.currentTime) || 0;
        timeline.max = String(duration || 100);
        if (!timeline.matches(":active")) timeline.value = String(Math.min(current, duration || 100));
        const pct = duration > 0 ? (current / duration) * 100 : 0;
        timeline.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, rgba(255,255,255,.17) ${pct}%)`;
        timeLabel.textContent = `${fmtClock(current)} / ${fmtClock(duration)}`;
        playBtn.classList.toggle("is-playing", !video.paused && !video.ended);
      };
      playBtn.addEventListener("click", () => {
        if (video.paused) video.play().catch(() => {});
        else video.pause();
      });
      timeline.addEventListener("input", () => {
        if (Number(video.duration)) video.currentTime = Number(timeline.value) || 0;
      });
      ["loadedmetadata", "durationchange", "timeupdate", "play", "pause", "ended", "emptied"].forEach((name) => {
        video.addEventListener(name, update);
      });
      update();
    });
  }

  function initMisc() {
    $$('input[name="precision"]', el.precisionGrid).forEach((input) => {
      input.addEventListener("change", () => updatePrecisionUI(input.value));
    });
    el.confidence.addEventListener("input", () => {
      el.confidenceValue.textContent = Number(el.confidence.value).toFixed(2);
    });
    [el.fontName, el.fontSize, el.borderWidth].forEach((node) => {
      node.addEventListener("change", updateAssDownloadLink);
      node.addEventListener("input", updateAssDownloadLink);
    });
    el.minTextHeight.addEventListener("input", () => {
      if (state.minGuideVisible) updateMinTextGuide();
    });
    [el.extractionStart, el.extractionEnd].forEach((input) => {
      input.addEventListener("input", updateRangeHint);
      input.addEventListener("blur", updateRangeHint);
    });
    el.rangeReset.addEventListener("click", () => {
      el.extractionStart.value = fmtCueTime(0);
      el.extractionEnd.value = fmtCueTime(state.duration || 0);
      updateRangeHint();
    });
    el.rangeStartNow.addEventListener("click", () => setRangeFromPlayhead("start"));
    el.rangeEndNow.addEventListener("click", () => setRangeFromPlayhead("end"));
    el.deleteBtn.addEventListener("click", deleteTask);
    el.saveSettingsBtn.addEventListener("click", saveCurrentSettings);
    el.extractRunSelected.addEventListener("click", runSelectedExtractions);
    el.extractDeleteSelected.addEventListener("click", deleteSelectedExtractions);
    el.extractSelectAll.addEventListener("change", () => {
      state.selectedExtractTasks.clear();
      if (el.extractSelectAll.checked) {
        el.extractTaskList.querySelectorAll(".task-rail-item").forEach((item) => {
          const button = item;
          if (button.dataset.taskId) state.selectedExtractTasks.add(button.dataset.taskId);
        });
      }
      refreshExtractTasks();
    });
    el.startBtn.addEventListener("click", startExtraction);
    el.cancelBtn.addEventListener("click", cancelTask);
    el.logToggle.addEventListener("click", () => {
      const collapsed = el.logBox.classList.toggle("is-collapsed");
      el.logToggle.textContent = collapsed ? "展开" : "收起";
    });
    el.helpBtn.addEventListener("click", () => openHelp(true));
    $$("[data-close]", el.helpModal).forEach((node) => node.addEventListener("click", () => openHelp(false)));
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (!el.cleanupModal.hidden) closeCleanupModal();
        else if (!el.mergeModal.hidden) closeMergeModal();
        else openHelp(false);
      }
      const active = document.activeElement;
      const editing = !!active && (
        ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName) || active.isContentEditable
      );
      if ((event.metaKey || event.ctrlKey) && !editing && !el.workspace.hidden && el.helpModal.hidden && !state.processing) {
        const key = event.key.toLowerCase();
        if (key === "z") {
          event.preventDefault();
          if (event.shiftKey) redoLast();
          else undoLast();
          return;
        }
        if (key === "y") {
          event.preventDefault();
          redoLast();
          return;
        }
      }
      if (!editing && !el.workspace.hidden && el.helpModal.hidden && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        event.preventDefault();
        const step = event.shiftKey ? 5 : (event.altKey ? 10 : 1);
        seekBy(event.key === "ArrowLeft" ? -step : step);
        return;
      }
      if (event.key === " " && !el.workspace.hidden && !["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
        event.preventDefault();
        togglePlay();
      }
    });
    window.addEventListener("beforeunload", (event) => {
      if (state.dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    });
  }

  function openHelp(open) {
    el.helpModal.hidden = !open;
    document.body.classList.toggle("no-scroll", open);
    if (open) $(".modal-close", el.helpModal).focus();
  }

  async function restoreLastJob() {
    const last = localStorage.getItem("hardsub.lastJob");
    if (!last) return;
    try {
      await openJob(last);
    } catch (_) {
      localStorage.removeItem("hardsub.lastJob");
    }
  }

  // ---------------------------------------------------------------- boot
  async function boot() {
    initUpload();
    initVideo();
    initVolume();
    initRoi();
    initTableEvents();
    initLanguageChips();
    initMisc();
    initSync();
    initMux();
    initCut();
    initTranslate();
    initFileDrops();
    initToolPlayers();
    setInterval(refreshTaskRails, 2500);
    checkHealth();
    await loadRecent();
    await restoreLastJob();
    if (!state.job) showLanding();
    refreshTaskRails();
  }

  boot();
})();
