---
name: puti-text-to-video
description: 當提到「文字轉影片」、「文案轉影片」、「Felo AI影片」、「日系排版影片」、「動態文字影片」、「備課轉影片」、「製作教學影片」或想要將文字大綱一鍵生成配音、字幕與動態排版之 1080p MP4 時載入此技能。
---

# Puti-AI 文字轉動態排版影片技能 (Text-to-Video Engine)

本技能受 Felo AI「Text to Video」啟發，以**純本地、零成本、高畫質**為核心原則，專為教師與講師設計。只需輸入文字資料、課文重點、演講大綱或教學逐字稿，即可自動完成「分鏡結構拆解 ➔ 台灣腔神經語音 ➔ 日系 Notion 質感排版 ➔ 逐句字幕膠囊 ➔ 柔和 BGM 側鏈混音」，一鍵輸出 1920x1080 60/30fps 橫式 MP4 教學影片。

---

## 核心特色與技術規範

1. **視覺風格**：日系極簡 / Notion 質感風。溫暖柔和米灰底（`#F7F6F2`）、白底大圓角懸浮卡片（`border-radius: 32px` + `1px solid #EBE9E1` 柔和微邊框 + 輕立體陰影）、高對比暖黑字體（`#2D2D2A`）。
2. **語音旁白**：微軟 Edge-TTS 台灣神經語音，預設使用親和自然的女聲 `zh-TW-HsiaoChenNeural`（曉臻），亦可指定沈穩男聲 `zh-TW-YunJheNeural`（雲哲）。
3. **逐句字幕膠囊**：畫面底部居中半透明深色膠囊（`rgba(35,35,33,0.88)` + 模糊濾鏡），與口白毫秒級精確同步。
4. **原聲暖心背景音樂**：內建 Jason Shaw 原聲木吉他指彈 BGM（立體聲 44.1kHz，音量平衡於 0.32），全片溫暖陪伴，結尾平滑淡出。
5. **本地純自動運作**：基於 Playwright Chromium 無頭錄製與 FFmpeg 壓制，無需昂貴雲端算力與 API 金鑰。
6. **PowerPoint & Canva 級全套動畫庫支援**：
   * **進入動畫**：淡化 (`fade`)、揚升/飛入 (`rise`)、平移 (`pan-right`)、漂浮 (`float`)、彈跳 (`pop`)、縮放旋轉 (`zoom-spin`)、擦去揭示 (`wipe`)、緩慢浮現 (`breathe`)、線條出現 (`line-reveal`)、飄移 (`drift`)、板塊移動 (`block-slide`)。
   * **強調動畫**：脈衝 (`pulse`)、陀螺轉 (`spin`)、蹺蹺板 (`teeter`)、閃爍高亮 (`flash`)、波浪動態 (`wave`)。
   可在任何分鏡 JSON 中指定 `"anim": "rise"` 或 `"anim": "pop"` 等參數一鍵套用！
7. **鐵則：動態即語意 (Semantic Motion Alignment & Continuous Stage)**：
   * **嚴禁無意義套用特效**：所有動畫必須精確對齊文字含意。例如提到「做減法」必須使用劃線刪除/減法意象 (`L16_Subtraction`)，**嚴禁倒立**！只有文案明確出現「倒過來 / 反過來 / 顛覆」時，才可旋轉 180°！提到「滑過去」使用卡片向左滑走 (`L17_SwipeDismiss`)！提到「焦慮/腦過熱」使用抖動 (`anim-anxiety`)！提到「以自己為核心」使用程式動態畫圓 (`L04_FocusCircle`)！
   * **舞臺連續性與縮小上升**：標題隨著口白推進，會平滑縮小並上升成為頁首抬頭 (`ascend-to-header`)，下方優雅帶出卡片或清單，而非突兀切頁。

---

## 13 大日系與 PowerPoint 動態分鏡版式 (Scene Layouts)

每個分鏡 JSON 物件必須具備 `layout`、`title` 與 `narration_lines`（台詞陣列）：

### `L00_GiantImpact`（超大震撼字 - PowerPoint 巨幅大字報衝擊）
* **適用情境**：震撼觀點、核心破題、反轉結論（字體高達 160px，產生巨大視覺震撼）。
* **JSON 範例**：
  ```json
  {
    "layout": "L00_GiantImpact",
    "title": "「我的」問題",
    "accent": true,
    "narration_lines": ["哪一個工具，可以解決「我的」問題？"]
  }
  ```

### `L01_HeroHook`（開場大標與共鳴提問）
* **JSON 範例**：
  ```json
  {
    "layout": "L01_HeroHook",
    "title": "這樣的經驗？",
    "subtitle": "你是不是也遇過？",
    "narration_lines": ["老師，你是不是也有這樣的經驗？"]
  }
  ```

### `L02_CardFlip`（卡片對調與觀點翻轉）
* **JSON 範例**：
  ```json
  {
    "layout": "L02_CardFlip",
    "title": "反過來的想法",
    "cards": [
      { "icon": "🛠️", "title": "先看工具" },
      { "icon": "🤔", "title": "才想用途" }
    ],
    "narration_lines": [
      "但今天，我想跟你聊一個反過來的想法。",
      "為什麼要反過來？因為先看到工具才想用途，通常用不了多久。"
    ]
  }
  ```

### `L03_InvertText`（文字 180° 翻轉倒立）
* **JSON 範例**：
  ```json
  {
    "layout": "L03_InvertText",
    "title": "我想跟各位老師說：",
    "highlight": "倒過來",
    "narration_lines": ["所以我想跟各位老師說：順序，應該要倒過來。"]
  }
  ```

### `L04_FocusCircle`（核心焦點圓形）
* **JSON 範例**：
  ```json
  {
    "layout": "L04_FocusCircle",
    "centerText": "自己",
    "satellites": ["很花時間", "很繁瑣"],
    "narration_lines": ["工作、教學或日常生活裡，有什麼事很花時間、很繁瑣，希望更快完成？"]
  }
  ```

### `L05_CardGrid`（案例與痛點卡片矩陣，2~3張）
* **JSON 範例**：
  ```json
  {
    "layout": "L05_CardGrid",
    "title": "找出痛點",
    "cards": [
      { "icon": "📝", "title": "出考卷", "desc": "出一份考卷要花很久" },
      { "icon": "🕒", "title": "會議記錄", "desc": "整理到半夜" },
      { "icon": "💬", "title": "家長提問", "desc": "一天要回覆二十次" }
    ],
    "narration_lines": [
      "先把這些痛點找出來：出一份考卷要花很久的時間。",
      "開完會，整理會議記錄整理到半夜。",
      "家長常常問一樣的問題，一天要回覆二十次。"
    ]
  }
  ```

### `L06_StepList`（步驟逐項點亮清單）
* **JSON 範例**：
  ```json
  {
    "layout": "L06_StepList",
    "title": "接下來，只要三個步驟",
    "steps": [
      "列出痛點",
      "AI 能幫忙嗎？ ✨",
      "帶著問題找工具 🔍"
    ],
    "narration_lines": [
      "第一步，列出你的痛點：什麼事最花時間、最重複？",
      "第二步，問自己：這件事情，AI 有沒有可能幫上忙？",
      "第三步，帶著你的問題，去找工具、找資源。"
    ]
  }
  ```

### `L07_HomeworkTimer`（小功課 5 分鐘倒數鐘）
* **JSON 範例**：
  ```json
  {
    "layout": "L07_HomeworkTimer",
    "title": "小功課：花五分鐘",
    "narration_lines": [
      "所以今天，我想留給你一個小功課。",
      "今天晚上花五分鐘，把工作與生活中最花時間的三件事寫下來。"
    ]
  }
  ```

### `L08_OutroCTA`（結尾行動與下次見）
* **JSON 範例**：
  ```json
  {
    "layout": "L08_OutroCTA",
    "title": "歡迎在留言區告訴我",
    "actionText": "下一支影片示範",
    "farewell": "我們下次見，掰掰！ 👋",
    "narration_lines": [
      "如果妳也有痛點，不確定 AI 能不能幫忙，歡迎在留言區告訴我。",
      "我們下次見，掰掰！"
    ]
  }
  ```

### `L09_ChatBubbles`（LINE 對話氣泡逐個彈出 - PPT 觸發動畫）
* **適用情境**：分享訊息、LINE 回覆、即時評論（氣泡逐個 Spring 彈跳進入，隨後浮現底部感想）。
* **JSON 範例**：
  ```json
  {
    "layout": "L09_ChatBubbles",
    "title": "這樣的經驗？",
    "bubbles": [
      { "icon": "💬", "text": "AI 自動回復 LINE", "theme": "line" },
      { "icon": "📄", "text": "影片轉重點", "theme": "blue" }
    ],
    "followupText": "好像不錯耶！",
    "narration_lines": [
      "滑手機時，看到有人分享：AI 可以串接 LINE，自動回復訊息。",
      "或是用 AI，把影片內容自動整理成重點。",
      "你心想：好像不錯耶，我們也來試試看！"
    ]
  }
  ```

### `L10_CardMorph`（單一焦點卡片狀態演化與變色 - PPT 強調動畫）
* **適用情境**：核心卡片隨著口白改變狀態（從彩色工具卡片，演化為灰階失焦無效狀態，並標記警告紅字與結論）。
* **JSON 範例**：
  ```json
  {
    "layout": "L10_CardMorph",
    "title": "解決別人的問題",
    "morphTitle": "不是你的痛點",
    "icon": "🛠️",
    "extraText": "試了兩次，就放著了",
    "narration_lines": [
      "網路上分享的工具，常是為了解決分享者自己的問題。",
      "他有他的困擾，那是他的痛點，不是你的。",
      "所以你搬回來用，可能試了兩次，就放著了。"
    ]
  }
  ```

### `L13_DataStat`（數據大字報 - 來自 HTML 簡報衝擊特效）
* **適用情境**：誇飾數據、成果展示、百分比（如 `99.9%`、`0成本`、`3倍速`）。
* **JSON 範例**：
  ```json
  {
    "layout": "L13_DataStat",
    "number": "99.9%",
    "label": "解決真實痛點的成功率",
    "description": "只要帶著明確需求，任何工具都能發揮價值",
    "statTheme": "accent",
    "narration_lines": ["當你帶著真實痛點出發，AI 的成功率將提升到百分之九十九。"]
  }
  ```

### `L14_Timeline`（里程碑時間軸 - 來自 HTML 簡報進程特效）
* **適用情境**：步驟階段、學習歷程、版本演進（節點隨口白依序點亮呼吸燈）。
* **JSON 範例**：
  ```json
  {
    "layout": "L14_Timeline",
    "title": "AI 實戰演進三階段",
    "steps": [
      { "title": "新手期", "desc": "為學日益・瘋狂做加法" },
      { "title": "沉澱期", "desc": "為道日損・開始做減法" },
      { "title": "高手期", "desc": "知所進退・隨心所欲" }
    ],
    "narration_lines": [
      "從新手期瘋狂做加法，",
      "到沉澱期學會做減法，",
      "最後成為隨心所欲的高手老師。"
    ]
  }
  ```

### `L15_BeforeAfter`（前後對比魔法卡片 - 來自 HTML 簡報轉型特效）
* **適用情境**：傳統作法 vs AI 賦能優化、焦慮 vs 釋懷。
* **JSON 範例**：
  ```json
  {
    "layout": "L15_BeforeAfter",
    "title": "心態轉變前後對比",
    "beforeTitle": "過去的你",
    "beforeDesc": "每天追新工具，資訊焦慮、大腦過熱",
    "afterTitle": "現在的你",
    "afterDesc": "知道什麼不必學，從容掌握自己的教學節奏",
    "narration_lines": [
      "過去每天追新工具，大腦過熱、疲憊不堪。",
      "現在知道什麼不必學，真正找回教學的從容與自由。"
    ]
  }
  ```

### `L16_Subtraction`（做減法 - 語意動態劃線扣除）
* **適用情境**：減輕負擔、精簡聚焦、刪除多餘干擾（珊瑚紅橫線動態劃過關鍵詞，下方浮現減法核心心法）。
* **JSON 範例**：
  ```json
  {
    "layout": "L16_Subtraction",
    "title": "所以現在我常提醒自己：",
    "highlight": "先做減法",
    "subText": "刪去多餘焦慮，聚焦真正痛點 ✨",
    "narration_lines": [
      "所以現在，我常提醒自己：不要一直做加法，先做減法！",
      "看到新的 AI 工具，先問自己三件事。"
    ]
  }
  ```

### `L17_SwipeDismiss`（放心滑過去 - 瀟灑滑走飛出）
* **適用情境**：放手不必要工具、忽略次要干擾（卡片微傾斜並瀟灑向左滑出螢幕，下方浮現豁達心得）。
* **JSON 範例**：
  ```json
  {
    "layout": "L17_SwipeDismiss",
    "title": "想一想：好像也不會怎樣",
    "icon": "📱",
    "cardTitle": "那就放心滑過去！",
    "followupText": "不重要的工具，瀟灑放手 🍃",
    "narration_lines": [
      "很多時候想一想：其實根本不會怎樣！",
      "那就放心地滑過去吧！"
    ]
  }
  ```

### 🎊 原生物理彩帶系統 (Native Confetti)
在結尾分鏡 `L08_OutroCTA` 或任何分鏡加上 `"confetti": true`，系統將自動啟動 Canvas 原生物理粒子引擎（模擬重力、阻力與旋轉），在畫面上噴發繽紛慶祝彩帶！

---

## 執行工作流

當使用者提出影片製作需求時，遵循以下 3 步全自動執行：

### 步驟 1：分鏡腳本生成
將使用者輸入的文字，重構為結構緊湊、節奏明確的 `project.json`。
* 總分鏡數建議在 5 ~ 10 個之間。
* 確保每句 `narration_lines` 口語自然、簡短有力（每句約 5~15 字為佳）。

### 步驟 2：呼叫核心渲染腳本
在終端直接執行：
```powershell
python "C:\Users\clong\.gemini\config\skills\puti-text-to-video\scripts\generate_video.py" --input "<專案目錄>\project.json" --output "<專案目錄>\output.mp4"
```
*(若使用者需要男聲，可加上 `--voice zh-TW-YunJheNeural`)*

### 步驟 3：產出回報
告知使用者影片已成功生成，並附上 `output.mp4` 檔案路徑與影片時長資訊。
