# Puti-AI | 文字轉動態排版影片技能 (Text-to-Video Engine)

> 受 Felo AI「Text to Video」啟發，專為教師與講師設計的**純本地、零 API 成本、1080p 高畫質動態排版影片生成引擎**。
> 只需輸入文字講義、教學重點或反思隨筆，全自動完成「分鏡語意拆解 ➔ 台灣腔神經語音合成 ➔ 毫秒級時間軸對齊 ➔ 日系流體動態排版錄製 ➔ 溫暖原聲木吉他立體聲混音」，一鍵輸出 1920x1080 MP4 短影音。

---

## ✨ 核心特色與技術架構

1. **純本地一條龍運行 (Zero Cloud Cost)**：
   * **語音合成**：微軟 Edge-TTS 台灣神經語音（預設女聲 `zh-TW-HsiaoChenNeural` 曉臻、可選男聲 `zh-TW-YunJheNeural` 雲哲），完全免費、無字數限制。
   * **動態錄製**：Playwright Headless Chromium 原生 1920x1080 錄製，以 60fps 捕捉 DOM 動態。
   * **音訊混音**：FFmpeg 44.1kHz 立體聲混音，加入 `loudnorm=I=-16:TP=-1.5:LRA=11` 進行社群標準廣播級響度正規化，音量飽滿結實、手機外放清晰震撼。
   * **手機友善清晰字幕**：大字級 `34px` (700 bold) 深色膠囊，手機無論直屏橫屏一秒看清。
   * **電影級運鏡與轉場**：0.65 秒疊化淡入淡出 (`Crossfade`) + 18 秒慢速微推鏡 (`Slow Push-In`)，畫面永不靜止死寂。

2. **動態即語意 (Form Follows Meaning)**：
   * 絕非機械式套用特效，每個動態均與文案語意嚴格對齊：
     * 「做減法」➔ 珊瑚紅橫線動態劃過文字（刪除線意象）。
     * 「滑過去」➔ 卡片物理傾角瀟灑向左滑出螢幕。
     * 「焦慮／大腦過熱」➔ 持續高頻微抖動動態。
     * 「以自己為核心」➔ 程式動態畫圓與衛星標籤浮現。

3. **連續空間推移舞臺 (Spatial Choreography)**：
   * 徹底摒棄死板的「整頁幻燈片閃退換頁」感。
   * 每一段落隨口白推進逐步「長出元素」：第 1 題滑入 ➔ 第 2 題推入 ➔ 第 3 題就位 ➔ 搜尋框落下打字。
   * 雙卡 3D 弧線物理對調（走三維高低錯身弧線，帶有 ±6° 傾角，真實實體卡片質感）。
   * 結尾 CTA 自動噴發純 Canvas 原生物理粒子彩帶。

4. **最高核心哲學：Text 是主角（文字即演員）**：
   * 文字不是貼在靜態卡片上的說明標籤，文字自身具備走位與情緒演繹！
   * 三個字、四個字（如「先做減法」「倒過來」「『我的』問題」）在滿版留白下具備最強視覺重心，不以多餘裝飾稀釋文字力量。

---

## 🎬 教學影片七段敘事黃金骨架 (The 7-Stage Pedagogical Arc)

1. **生活經驗與共鳴提問 (Hook)**：日常經驗破題引發共鳴（`L01_HeroHook`）。
2. **資訊焦慮與現實困境 (Agony)**：氣泡逐一彈出，引爆大腦過熱焦慮（`L09_ChatBubbles`）。
3. **原地變質與迷思反思 (Truth)**：單卡原地斷電褪灰，標題轉紅警告（`L10_CardMorph`）。
4. **核心 3~4 字震撼破題 (Kinetic Shock)**：滿版留白 + 130px 大字 + 動態劃線（`L00_GiantImpact` / `L16_Subtraction`）。
5. **具體三問與空間生長 (Step Reveal)**：步驟逐條「1️⃣ ➔ 2️⃣ ➔ 3️⃣」生長推入，搜尋列敲出結論（`L06_StepList`）。
6. **瀟灑放手與知所進退 (Mastery)**：卡片向左滑走飛出（`L17_SwipeDismiss`），雙卡 3D 空間弧線物理對調（`L02_CardFlip`）。
7. **行動呼籲與彩帶收尾 (Outro & Confetti)**：下集預告/思考題，全螢幕噴灑 Canvas 原生物理彩帶（`L08_OutroCTA`）。

---

## 🎨 13 大動態分鏡版式 (Scene Layouts)

* `L00_GiantImpact`（巨幅大字報衝擊 + 金邊語錄膠囊彈出）
* `L01_HeroHook`（開場大標與共鳴提問）
* `L02_CardFlip`（卡片 3D 空間弧線物理對調）
* `L03_InvertText`（180° 倒立翻轉，專屬反轉關鍵詞）
* `L04_FocusCircle`（程式動態畫圓焦點容器）
* `L05_CardGrid`（痛點/案例卡片矩陣，隨口白推移進場）
* `L06_StepList`（三步驟漸進生長清單 + 打字機搜尋列）
* `L07_HomeworkTimer`（小功課 5:00 圓形時鐘 + 填空線）
* `L08_OutroCTA`（結尾行動引導 + 原生物理彩帶噴灑）
* `L09_ChatBubbles`（LINE / 微信風格對話氣泡逐個彈出 + 焦慮引爆）
* `L10_CardMorph`（單卡原地變質斷電褪灰 + 標題轉紅警示）
* `L13_DataStat`（150px 巨幅數字大字報）
* `L14_Timeline`（里程碑時間軸呼吸節點）
* `L15_BeforeAfter`（前後對比魔法卡片）
* `L16_Subtraction`（做減法動態劃線扣除）
* `L17_SwipeDismiss`（瀟灑向左滑走飛出）

---

## 🚀 快速開始

### 環境需求
* Python 3.10+
* Playwright (`pip install playwright && playwright install chromium`)
* Edge-TTS (`pip install edge-tts`)
* FFmpeg（已加入系統 PATH）

### 一鍵生成影片
```powershell
python scripts/generate_video.py --input "path/to/project.json" --output "output.mp4"
```

* 切換男聲：加入 `--voice zh-TW-YunJheNeural`
* 自訂背景音樂：加入 `--bgm "path/to/music.mp3"`
* 保留錄製中間工作區：加入 `--keep-temp`

---

## 📄 版權宣告

屏東縣後庄國小黃朝榮老師作品，免費分享，歡迎擴散推廣，嚴禁商用與任何侵權、不尊重著作權的行為，更多 Puti-AI 教學工具 點此前往(https://padlet.com/clongwh/puti_ai_tools)。
