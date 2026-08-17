// 飞书皮肤资产：设计 token(明/暗) + 专属 CSS + 品牌 logo SVG。
// 纯数据，不依赖 react，可被任意打包入口单独引用(阶段2单皮肤包的基础)。

// 飞书官方设计系统(Lark design language)校准后的色值：
//   品牌蓝 #1456F0(不是抖音系 #3370FF)、文字 #1F2329/#646A73/#8F959E、
//   背景 #F5F6F7 / #EFF0F1、边框 #DEE0E3 / #D0D3D6、气泡背景 #F5F6F7。
export const DEFAULT_TOKENS_LIGHT = {
  "brand-primary": "#1456F0", "brand-text": "#1456F0", "brand-primary-invert": "#FFFFFF",
  "brand-primary-new-colorprimary-new-color": "#1456F0",
  "bg-base": "#FFFFFF", "bg-layer-1": "#F5F6F7", "bg-layer-2": "#EFF0F1", "bg-layer-3": "#EFF0F1",
  "label-primary": "#1F2329", "label-secondary": "#646A73", "label-tertiary": "#8F959E",
  "label-primary-foreground": "#FFFFFF", "label-primary-inverted": "#FFFFFF",
  "label-primary-bluish": "#1456F0", "label-primary-dimmed": "#8F959E",
  "label-caption": "#8F959E", "label-dimmed": "#BBBFC4",
  "border-l1": "#DEE0E3", "border-l2": "#DEE0E3", "border-l3": "#D0D3D6",
  "interactive-bg-hover": "#EFF0F1", "interactive-bg-active": "#E8EAED",
  "interactive-bg-hover-accent": "#EAF1FF",
  "button-primary-fill": "#1456F0", "button-primary-hover": "#0F4BD8", "button-primary-dimmed": "#D9E4FF",
  "state-success-primary": "#34C724", "state-error-primary": "#F54A45", "state-warn-primary": "#FF8800",
  "state-business-primary": "#1456F0", "tooltip-bg": "#1F2329", "toast-bg": "#1F2329"
};

export const DEFAULT_TOKENS_DARK = {
  "brand-primary": "#4C88FF", "brand-text": "#4C88FF", "brand-primary-invert": "#FFFFFF",
  "brand-primary-new-colorprimary-new-color": "#4C88FF",
  "bg-base": "#1A1A1A", "bg-layer-1": "#17191A", "bg-layer-2": "#232425", "bg-layer-3": "#2B2D2E",
  "label-primary": "#E8EAED", "label-secondary": "#9CA0A8", "label-tertiary": "#6F7378",
  "label-primary-foreground": "#FFFFFF", "label-primary-inverted": "#1F2329",
  "label-primary-bluish": "#4C88FF", "label-primary-dimmed": "#6F7378",
  "label-caption": "#6F7378", "label-dimmed": "#4A4D52",
  "border-l1": "#3A3C40", "border-l2": "#34363A", "border-l3": "#2E3034",
  "interactive-bg-hover": "#2B2D2E", "interactive-bg-active": "#333637",
  "interactive-bg-hover-accent": "#223354",
  "button-primary-fill": "#4C88FF", "button-primary-hover": "#3D7BFF", "button-primary-dimmed": "#223354",
  "state-success-primary": "#45D538", "state-error-primary": "#FF5A57", "state-warn-primary": "#FFA940",
  "state-business-primary": "#4C88FF", "tooltip-bg": "#2B2D2E", "toast-bg": "#2B2D2E"
};

export const FEISHU_CSS = [
  // ===================== 品牌徽章 =====================
  // 保留原 DeepSeek 鲸鱼 icon，只在旁边追加当前皮肤名徽章。
  'html[data-chatlab-skin="feishu"] [class*="brand"] { display: inline-flex; align-items: center; gap: 8px; }',
  'html[data-chatlab-skin="feishu"] .cl-brand-skin { font-size: 11px; font-weight: 500; color: #1456F0; background: var(--dsw-alias-interactive-bg-hover-accent); border-radius: 4px; padding: 1px 6px; white-space: nowrap; }',
  // ===================== 左侧：项目组(Meego 风) =====================
  'html[data-chatlab-skin="feishu"] [class*="projectRow"] { margin: 1px 8px; border-radius: 8px; transition: background .15s ease; }',
  'html[data-chatlab-skin="feishu"] [class*="projectRow"]:hover { background: var(--dsw-alias-interactive-bg-hover); }',
  'html[data-chatlab-skin="feishu"] [class*="projectText"] { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary); }',
  // folder 图标用 currentColor，但依赖 var(--dsw-alias-brand-primary) 在 sidebar 作用域里
  // 解析不稳定(实测不生效)，和气泡一样硬编码飞书蓝。
  'html[data-chatlab-skin="feishu"] [class*="folder"], html[data-chatlab-skin="feishu"] [class*="folderActive"] { color: #1456F0 !important; }',
  'html[data-chatlab-skin="feishu"] [class*="chevron"], html[data-chatlab-skin="feishu"] [class*="arrow"] { color: var(--dsw-alias-label-tertiary); }',
  'html[data-chatlab-skin="feishu"] [class*="sectionHeader"] { background: transparent; }',
  'html[data-chatlab-skin="feishu"] [class*="sectionLabel"] { font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-tertiary); letter-spacing: .02em; background: none; }',
  // 左侧：会话行(联系人 / IM)
  // 用 CSS Grid 实现：头像跨两行垂直居中，标题/时间在第一行，预览在第二行。
  // grid 不移动任何 React 节点(避免 reconcile 崩溃)，纯布局重排。
  // 列：头像 | 标题(自适应) | 时间 | 三点；行：标题行 / 预览行。
  'html[data-chatlab-skin="feishu"] [class*="sessionRow"] { display: grid; grid-template-columns: 32px minmax(0, 1fr) auto auto; grid-template-rows: 20px 16px; column-gap: 8px; row-gap: 3px; align-items: center; height: auto !important; min-height: 52px; padding: 6px 10px; margin: 1px 8px; border-radius: 8px; box-sizing: border-box; }',
  'html[data-chatlab-skin="feishu"] [class*="sessionRow"]:hover { background: var(--dsw-alias-interactive-bg-hover); }',
  'html[data-chatlab-skin="feishu"] [class*="sessionRow"][class*="selected"] { background: var(--dsw-alias-interactive-bg-hover-accent); }',
  // 标题：第一行第 2 列，占满剩余宽度
  'html[data-chatlab-skin="feishu"] [class*="sessionRow"] [class*="title"] { grid-column: 2; grid-row: 1; min-width: 0; margin: 0; font-size: 14px; font-weight: 500; line-height: 20px; color: var(--dsw-alias-label-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
  // 时间：第一行第 3 列
  'html[data-chatlab-skin="feishu"] [class*="sessionRow"] [class*="time"] { grid-column: 3; grid-row: 1; font-size: 11px; line-height: 20px; color: var(--dsw-alias-label-tertiary); font-variant-numeric: tabular-nums; }',
  // 三点操作：第一行第 4 列(hover 才显示，默认 display:none 不占格)
  'html[data-chatlab-skin="feishu"] [class*="sessionRow"] [class*="rowActions"] { grid-column: 4; grid-row: 1; }',
  'html[data-chatlab-skin="feishu"] [class*="sessionRow"].cl-unread [class*="title"] { font-weight: 600; }',
  // 未读红点：头像右上角(绝对定位，不占 grid 格子)。
  'html[data-chatlab-skin="feishu"] .cl-unread-dot { position: absolute; top: 4px; left: 36px; width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-state-error-primary); box-shadow: 0 0 0 2px var(--dsw-alias-bg-base); z-index: 1; }',
  // sessionRow 需要相对定位供红点锚定
  'html[data-chatlab-skin="feishu"] [class*="sessionRow"] { position: relative; }',
  // 预览：第二行，从第 2 列跨到第 4 列(对齐标题列)
  'html[data-chatlab-skin="feishu"] .cl-preview { grid-column: 2 / span 3; grid-row: 2; min-width: 0; margin: 0; font-size: 12px; line-height: 16px; color: var(--dsw-alias-label-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
  // 搜索框：只碰展开态
  'html[data-chatlab-skin="feishu"] [class*="searchExpanded"] { background: var(--dsw-alias-bg-layer-2); border-color: var(--dsw-alias-border-l2); border-radius: 10px; gap: 4px; }',
  'html[data-chatlab-skin="feishu"] [class*="searchExpanded"]:hover { border-color: var(--dsw-alias-border-l3); }',
  'html[data-chatlab-skin="feishu"] [class*="searchInput"] { font-size: 13px; color: var(--dsw-alias-label-primary); }',
  'html[data-chatlab-skin="feishu"] [class*="searchInput"]::placeholder { color: var(--dsw-alias-label-tertiary); }',
  'html[data-chatlab-skin="feishu"] [class*="searchButton"], html[data-chatlab-skin="feishu"] [class*="clearButton"] { color: var(--dsw-alias-label-tertiary); background: transparent; }',
  // 聊天：消息气泡
  // 真实结构：用户消息 = [data-chat-flow-kind="user"] → .gdEzaW_bubble(原生已右对齐)
  //           assistant = [data-chat-flow-kind="assistant-step"] → .Sxvs8a_body(通栏正文)
  // 飞书：用户气泡蓝色白字 + 已读✓；assistant 保持通栏正文(飞书 bot 回复不套气泡)。
  'html[data-chatlab-skin="feishu"] [class*="gdEzaW_bubble"] { background: #1456F0 !important; color: #FFFFFF !important; border-radius: 18px 4px 18px 18px; padding: 9px 14px; font-size: 15px; line-height: 22px; box-shadow: 0 1px 2px rgba(0,0,0,.08); }',
  'html[data-chatlab-skin="feishu"] [class*="gdEzaW_userStack"] { max-width: min(480px, 78%); }',
  // 用户气泡右下角"已读✓"(飞书私聊)
  'html[data-chatlab-skin="feishu"] [class*="gdEzaW_userRow"] [class*="gdEzaW_bubble"]::after { content: "已读"; margin-left: 8px; font-size: 11px; color: rgba(255,255,255,.7); }',
  // assistant 正文：通栏，飞书 bot 回复风格
  'html[data-chatlab-skin="feishu"] [class*="Sxvs8a_body"] { font-size: 15px; line-height: 24px; }',
  // 输入框(composer)
  'html[data-chatlab-skin="feishu"] [data-composer-card] { border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px; background: var(--dsw-alias-bg-base); box-shadow: 0 1px 4px rgba(0,0,0,.05); }',
  // 聊天：顶栏
  'html[data-chatlab-skin="feishu"] [class*="titleCluster"] [class*="crumbCurrent"] { font-size: 15px; font-weight: 600; color: var(--dsw-alias-label-primary); }',
  'html[data-chatlab-skin="feishu"] [class*="tabs"] { gap: 28px; }',
  'html[data-chatlab-skin="feishu"] [class*="tab"] { font-size: 13px; font-weight: 500; color: var(--dsw-alias-label-tertiary); }',
  'html[data-chatlab-skin="feishu"] [class*="tabActive"] { color: #1456F0 !important; }',
  'html[data-chatlab-skin="feishu"] [class*="tabActive"]::after { background: #1456F0 !important; }',
  // 头像：grid 第 1 列、跨两行，垂直居中。
  'html[data-chatlab-skin="feishu"] .cl-avatar { width: 32px; height: 32px; border-radius: 50%; grid-column: 1; grid-row: 1 / span 2; justify-self: start; align-self: center; }',
  // 会话行里那个 16px 空状态槽(slot)在飞书风格里不需要，display:none 彻底移除。
  'html[data-chatlab-skin="feishu"] [class*="sessionRow"] [class*="slot"] { display: none !important; }',
  // 顶部头像：order:-1 排到面包屑前，margin-left 撑开与面包屑间距(用户调试值)。
  'html[data-chatlab-skin="feishu"] .cl-header-avatar { width: 28px; height: 28px; border-radius: 50%; margin: 0 0 0 8px; flex: none; align-self: center; order: -1; }',
  // 项目组彩色方块图标(Meego 风)。原文件夹 SVG 用 CSS 隐藏(不删节点)，只显示叠加的彩色方块。
  'html[data-chatlab-skin="feishu"] [class*="projectRow"] [class*="folder"] > svg { display: none; }',
  'html[data-chatlab-skin="feishu"] .cl-project-icon { width: 16px; height: 16px; border-radius: 4px; flex: none; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #FFFFFF; line-height: 1; }',
  // ===================== 正在输入(飞书/微信式：输入框上方小字 + 三点跳动) =====================
  // 注意：dock 是 display:contents，typing 会被摊开成块级，必须 width:fit-content 收缩到内容宽，
  // 否则会横跨整个输入区显得很怪。
  'html[data-chatlab-skin="feishu"] .cl-typing { display: inline-flex; align-items: center; gap: 4px; width: fit-content; margin: 0 0 4px 4px; padding: 2px 8px; border-radius: 6px; background: var(--dsw-alias-bg-layer-2); font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); }',
  'html[data-chatlab-skin="feishu"] .cl-typing-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--dsw-alias-label-tertiary); animation: cl-typing-bounce 1.2s infinite; }',
  'html[data-chatlab-skin="feishu"] .cl-typing-dot:nth-child(3) { animation-delay: .2s; }',
  'html[data-chatlab-skin="feishu"] .cl-typing-dot:nth-child(4) { animation-delay: .4s; }',
  '@keyframes cl-typing-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: .4; } 30% { transform: translateY(-3px); opacity: 1; } }',
  // ===================== 原生回合状态("Deep diving...")→ 飞书"正在输入…" =====================
  // 原文字用透明色+渐变裁剪(shimmer)渲染，CSS 无法直接改文本节点：
  // font-size:0 隐藏原文本 + background/animation:none 去掉流光。
  // 新内容("正在输入"+三点错峰跳动)由 core 的 decorateTurnStatus 注入到时钟之前，
  // 圆点复用 .cl-typing-dot 的错峰动效。
  'html[data-chatlab-skin="feishu"] [class*="turnStatus"]:not([class*="turnStatusClock"]) { font-size: 0; background: none; animation: none; -webkit-text-fill-color: var(--dsw-alias-label-tertiary); }',
  'html[data-chatlab-skin="feishu"] .cl-turn-typing { display: inline-flex; align-items: center; gap: 4px; font-size: 12.5px; font-weight: 400; line-height: 18px; color: var(--dsw-alias-label-secondary); letter-spacing: .01em; white-space: nowrap; }',
  'html[data-chatlab-skin="feishu"] .cl-turn-typing .cl-typing-dot { width: 5px; height: 5px; background: var(--dsw-alias-label-secondary); }',
  'html[data-chatlab-skin="feishu"] [class*="turnStatusClock"] { font-size: 11px; color: var(--dsw-alias-label-tertiary); -webkit-text-fill-color: var(--dsw-alias-label-tertiary); margin-left: 6px; }'
].join("\n");
