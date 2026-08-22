# Chat-platform UI skins: primary-source research

**Scope.** This report studies Slack, WeCom (企业微信), DingTalk (钉钉), Telegram, and WhatsApp as interaction references for ChatLab skins. It focuses on observable product grammar rather than copying logos, icons, names, colors, typography, or other proprietary assets. Claims are linked to first-party design articles, help centers, product pages, API documentation, or official app listings. Where a vendor does not publish a detailed UI specification, the report labels the conclusion as an inference or an evidence gap rather than presenting it as a fact.

**Repository convention.** The repository had no dedicated research/design-notes directory or naming convention; existing Markdown files are package READMEs and project-level documentation. This report therefore lives at `research/chat-platform-ui-skins.md`. No product code is changed by this report.

## Executive summary

The five products represent two broad interaction families:

1. **Workspaces and enterprise hubs.** Slack, WeCom, and DingTalk organize communication around an organization, work groups, channels or departments, files, meetings, and operational tools. Slack makes the channel/thread model especially explicit; WeCom and DingTalk combine chat with enterprise directory, customer, document, approval, calendar, and meeting workflows. Slack documents this as a hierarchy of workspaces, channels, direct messages, threads, activity, files, and canvases; Tencent and DingTalk describe a similarly broad enterprise surface around messaging and office collaboration. ([Slack quick start](https://slack.com/help/articles/360059928654-How-to-use-Slack--your-quick-start-guide), [Slack redesigned IA](https://slack.com/blog/productivity/a-redesigned-slack-built-for-focus), [Tencent WeCom](https://www.tencent.com/products/wecom/), [DingTalk features](https://www.dingtalk.com/static/h5dingfeatures))
2. **Contact-centric messengers.** Telegram and WhatsApp make a person/group chat list the primary home, then add broadcast or community structures around it. Telegram exposes folders, channels, group topics, saved messages, and rich global search; WhatsApp exposes chats plus calls, status, communities, and channels as adjacent surfaces. ([Telegram FAQ](https://telegram.org/faq), [Telegram search](https://core.telegram.org/api/search), [WhatsApp features](https://www.whatsapp.com/features))

For an original skin, the durable lessons are interaction-level: make unread state legible, keep navigation reversible, separate conversation content from collaboration artifacts, make replies/reactions first-class message metadata, and treat desktop/tablet/mobile as different information-density modes. The risky shortcuts are asset-level: copying a recognizable brand palette, logo, wordmark, mascot, proprietary icon set, or exact branded layout.

---

## 1. Slack

### 1.1 Interaction model and information architecture

Slack’s core object model is an organization/workspace containing channels, direct messages, group direct messages, threads, files, canvases, and app surfaces. Slack’s quick-start guide presents channels and direct messages as the principal places to communicate, while its redesign describes a hierarchy that needed another level of organization as the product grew. ([Slack quick start](https://slack.com/help/articles/360059928654-How-to-use-Slack--your-quick-start-guide), [Slack redesigned IA](https://slack.com/blog/productivity/a-redesigned-slack-built-for-focus))

A channel is the durable, shared stream; a thread is a subordinate discussion attached to a parent message. Slack documents thread controls for replying, following or unfollowing a thread, and configuring thread notifications, which makes the thread a navigable object rather than merely a visual indentation. ([Slack threads](https://slack.com/help/articles/115000769927-Use-threads-to-organize-discussions-))

Slack also separates attention management from the stream. Its redesigned experience describes a unified activity area for mentions, thread replies, reactions, and app notifications, reducing the need to visit each source location to discover work. ([Slack redesigned IA](https://slack.com/blog/productivity/a-redesigned-slack-built-for-focus), [Slack Activity view](https://slack.com/help/articles/19693583638803-Get-your-work-done-from-the-Activity-view))

**Skin implication.** A faithful-but-original Slack-like skin should model at least `workspace -> channel/DM -> message -> thread`, plus a separate attention inbox. Do not flatten thread replies into ordinary messages if the target experience depends on returning to a parent and following its activity.

### 1.2 Visual and design language

Slack’s design team describes a visual refresh that retained the recognizable structure and information density while making the interface more approachable and personal. The documented changes include gradients, translucent surfaces, rounded controls and avatars, softer borders, and more depth/elevation. ([A new visual language for Slack](https://slack.design/articles/a-new-visual-language-for-slack/))

Slack’s theme work emphasizes constrained, predictable customization: the article says the settings were reduced to four controls, users choose from predefined palettes, and the same palette logic is intended to work across desktop and mobile. ([A new visual language for Slack](https://slack.design/articles/a-new-visual-language-for-slack/))

The visual language is therefore not just a color choice; it is a system of surface hierarchy, rounded interactive objects, controlled contrast, and motion/attention signals. The article describes “Bloops” as visual activity indicators in top-level navigation and “Peeks” as previews that expose content without fully leaving the current task. ([A new visual language for Slack](https://slack.design/articles/a-new-visual-language-for-slack/))

**Originality boundary.** Reuse the abstract principles—layered surfaces, bounded theming, previews, and nonnumeric activity signals—but choose an independent palette, shape language, iconography, and naming.

### 1.3 Navigation and conversation list

Slack’s classic desktop structure uses a workspace/navigation rail and a conversation-oriented sidebar. Slack’s simplified layout documentation describes a mode with a single navigation bar and unread-item badges, showing that the product can collapse its navigation chrome while preserving attention signals. ([Slack simplified layout](https://slack.com/help/articles/41214514885907-Use-simplified-layout-mode-in-Slack))

The redesign article describes the need to organize a growing hierarchy and reduce “pogo-sticking,” or repeated movement between locations. This supports a navigation model in which the sidebar is not only a directory but also an attention surface. ([Slack redesigned IA](https://slack.com/blog/productivity/a-redesigned-slack-built-for-focus))

A conversation-list row needs more than a name and timestamp. Slack’s documented Bloops can communicate incoming messages, thread replies, reactions, or a sender-specific event; previews can expose the likely destination before navigation. ([A new visual language for Slack](https://slack.design/articles/a-new-visual-language-for-slack/))

### 1.4 Chat details and message composition

Slack messages live in channels or DMs and can launch threads, reactions, huddles, canvases, and file interactions. The official Block Kit documentation further shows that Slack treats message and app surfaces as composable layouts made from blocks and elements, not as an undifferentiated text bubble. ([Slack surfaces](https://docs.slack.dev/surfaces/), [Slack Block Kit](https://docs.slack.dev/block-kit/))

The resulting composition model is a rich editor with text plus mentions, attachments/files, emoji/reactions, and actions. A skin should reserve space for a persistent composer toolbar, but avoid assuming that every attachment is a bubble: files, canvases, and interactive blocks often require their own preview and action affordances. ([Slack quick start](https://slack.com/help/articles/360059928654-How-to-use-Slack--your-quick-start-guide), [Slack surfaces](https://docs.slack.dev/surfaces/))

### 1.5 Presence, status, and notifications

Slack distinguishes availability/status from message activity. Its status help page documents setting a status and availability, while its notification guide documents desktop, mobile, email, thread-reply, mention, keyword, DM, and huddle notification controls. ([Slack status and availability](https://slack.com/help/articles/205240127-Set-your-Slack-status-and-availability), [Slack notifications](https://slack.com/help/articles/360025446073-Guide-to-Slack-notifications))

The UI implication is that a green/active indicator alone is insufficient. A skin should represent at least `availability`, `custom status`, `muted`, `notification preference`, and `unread attention` as separate state dimensions. Slack’s Bloops illustrate why: a user can be available without an unread event, and an unread event can matter even when the sender is not currently active. ([A new visual language for Slack](https://slack.design/articles/a-new-visual-language-for-slack/), [Slack notifications](https://slack.com/help/articles/360025446073-Guide-to-Slack-notifications))

### 1.6 Reactions, replies, and threads

Slack supports emoji reactions on messages and other collaborative surfaces; the help center documents adding and managing reactions. ([Slack emoji and reactions](https://slack.com/help/articles/202931348-Use-emoji-and-reactions))

Threads are attached to a parent message, can be followed/unfollowed, and have their own notification behavior. This gives Slack a two-axis attention model: the channel timeline and the reply stream. ([Slack threads](https://slack.com/help/articles/115000769927-Use-threads-to-organize-discussions-))

**Implementation note.** Store reactions as a set keyed by reaction identity and user, not as a rendered emoji string. Store thread membership and follow state separately from message text so the same message can be shown in the timeline, a thread panel, and an activity inbox.

### 1.7 Files, media, and collaborative artifacts

Slack’s Files area is used to browse and search shared files and canvases; the canvas help page documents creating, sharing, searching, commenting on, reacting to, and managing canvases. ([Slack canvas](https://slack.com/help/articles/203950418-Use-a-canvas-in-Slack), [Slack files](https://slack.com/help/articles/360057449973-Manage-files-in-Slack))

This creates a distinction between a file attachment (an event in a conversation) and a durable collaborative artifact (a canvas that can be revisited, searched, commented on, and reacted to). A skin should model both: an attachment card in the timeline and a document/artifact detail view.

### 1.8 Calls and huddles

Slack huddles can begin in channels or DMs, include audio/video or screen sharing, expose a discussion thread, and use a canvas for notes. Slack documents huddle-specific notifications and preferences as well. ([Slack huddles](https://slack.com/help/articles/4402059015315-Use-huddles-in-Slack))

The call is therefore contextual: it is launched from a conversation and leaves a durable trail of discussion/notes. A ChatLab skin can preserve this grammar with a call state attached to a conversation, a compact participant strip, screen-share state, and a post-call note/event card.

### 1.9 Search

Slack’s quick-start and file documentation describe search across messages, files, channels, and people, with a Files area for browsing shared files and canvases. ([Slack quick start](https://slack.com/help/articles/360059928654-How-to-use-Slack--your-quick-start-guide), [Slack canvas](https://slack.com/help/articles/203950418-Use-a-canvas-in-Slack))

Search should consequently be global and typed: a query can resolve to a message, a person, a conversation, a file, or a canvas. Preserve a result type, source conversation, timestamp, and jump target rather than returning text-only hits.

### 1.10 Responsive behavior

Slack’s iPad redesign article describes adapting the product to iPadOS navigation and layout constraints, and its mobile redesign article discusses reducing clutter, handling headers and core tabs, and adapting the growing feature set to mobile. ([Slack on iPad](https://slack.design/articles/how-we-redesigned-slack-for-the-ipad/), [Slack mobile redesign](https://slack.design/articles/re-designing-slack-on-mobile/))

The important behavior is not simply “shrink desktop.” Desktop can expose navigation, list, message stream, and detail/threads simultaneously; tablet negotiates split views and platform conventions; mobile prioritizes a small set of top-level tabs and pushes secondary context into sheets or nested screens. ([Slack on iPad](https://slack.design/articles/how-we-redesigned-slack-for-the-ipad/), [Slack mobile redesign](https://slack.design/articles/re-designing-slack-on-mobile/))

### 1.11 Distinctive interaction patterns

- **Bloops:** activity-specific visual signals in top-level navigation. ([A new visual language for Slack](https://slack.design/articles/a-new-visual-language-for-slack/))
- **Peeks:** hover/previews that expose activity without abandoning the current context. ([A new visual language for Slack](https://slack.design/articles/a-new-visual-language-for-slack/))
- **Activity as a unified destination:** mentions, reactions, thread replies, and app events in one attention area. ([Slack Activity view](https://slack.com/help/articles/19693583638803-Get-your-work-done-from-the-Activity-view))
- **Conversation-attached huddles:** calls, screen sharing, discussion, and notes remain related to the originating channel or DM. ([Slack huddles](https://slack.com/help/articles/4402059015315-Use-huddles-in-Slack))
- **Composable message surfaces:** blocks and elements support structured, interactive messages. ([Slack Block Kit](https://docs.slack.dev/block-kit/))

---

## 2. WeCom (企业微信)

### 2.1 Interaction model and information architecture

Tencent positions WeCom as an enterprise communication and office-automation platform, not only a private messenger. Its product description includes enterprise messaging, office functions, connections to Weixin, Mini Programs, Weixin Pay, third-party apps, and more than 200 APIs. ([Tencent WeCom](https://www.tencent.com/products/wecom/), [Tencent WeCom Chinese overview](https://www.tencent.com/zh-cn/products/wecom/), [Tencent remote working and collaboration](https://www.tencent.com/products/remote-working-collaboration/))

The central information architecture is therefore organization-first: employees, departments, internal groups, customer/private chats, customer groups, applications, documents, and meetings coexist. Tencent specifically describes customer continuity as belonging to the enterprise rather than an individual employee, which is a different ownership model from a consumer address book. ([Tencent WeCom](https://www.tencent.com/products/wecom/))

Official app listings describe a broad workspace containing enterprise directories, internal messages, Weixin customer/customer-group communication, meetings, screen/document sharing, collaborative documents and sheets, file storage, email, and office applications. ([WeCom on Google Play](https://play.google.com/store/apps/details?gl=US&id=com.tencent.wework), [WeCom on the App Store](https://apps.apple.com/us/app/wecom-work-communication-tools/id1087897068))

**Skin implication.** A WeCom-inspired skin should make the organization directory and work surfaces discoverable without turning every feature into a chat bubble. Model at least `organization/person`, `internal conversation`, `external/customer conversation`, `group`, `app/workflow`, `meeting`, and `document/file` as distinct object types.

### 2.2 Visual/design language

Tencent’s public product material emphasizes enterprise communication, security, integrations, and work efficiency rather than publishing a component-level visual design system. The user-facing app listings likewise foreground capabilities—directory, messaging, meetings, documents, storage, and applications—rather than token specifications. ([Tencent WeCom](https://www.tencent.com/products/wecom/), [WeCom on Google Play](https://play.google.com/store/apps/details?gl=US&id=com.tencent.wework))

The defensible design inference is **utility-first enterprise density**: a skin should prioritize hierarchy, directory context, permissions, and work artifacts over a purely social or decorative conversation view. This is an inference from the documented product scope, not a claim that Tencent mandates particular colors, radii, or spacing. ([Tencent remote working and collaboration](https://www.tencent.com/products/remote-working-collaboration/), [WeCom on the App Store](https://apps.apple.com/us/app/wecom-work-communication-tools/id1087897068))

### 2.3 Navigation and conversation list

The official descriptions imply multiple entry points beyond a single recent-chat list: enterprise directory, internal and external contacts, customer groups, documents/drive, email, meetings, and office applications. ([WeCom on Google Play](https://play.google.com/store/apps/details?gl=US&id=com.tencent.wework), [WeCom on the App Store](https://apps.apple.com/us/app/wecom-work-communication-tools/id1087897068))

A faithful original skin should use a primary navigation model such as `Chats`, `Contacts/Directory`, `Work`, and `Me/Settings`, with filters or badges for internal, external, customer, and group conversations. Keep the directory relation visible in a conversation header so the same display name can be disambiguated by department, organization, or customer relationship.

### 2.4 Chat details and message composition

Google Play’s first-party listing describes real-time messaging, message synchronization, customer and customer-group communication, group tools, meetings with screen/document sharing, collaborative documents and sheets, and file storage. ([WeCom on Google Play](https://play.google.com/store/apps/details?gl=US&id=com.tencent.wework))

The composition model should therefore support ordinary text plus images/files, voice or meeting entry points, mentions/group controls, and document/file cards. The content area should make sender identity and relationship context clear—for example, employee/department or customer/external label—without relying on a brand-specific badge.

### 2.5 Presence, status, and notifications

The cited public Tencent product pages and app listings emphasize enterprise directory, messaging, customer connection, meetings, documents, and security, but do not provide a single public, UI-level specification for generalized online presence, typing indicators, or notification badge semantics. ([Tencent WeCom](https://www.tencent.com/products/wecom/), [WeCom on the App Store](https://apps.apple.com/us/app/wecom-work-communication-tools/id1087897068))

This is an evidence gap, not evidence that the product lacks these states. For an original skin, keep presence modular: `online/away/offline` can be supplied by the host, while `unread`, `mention`, `approval`, `meeting reminder`, and `customer follow-up` should remain separate event classes. Do not collapse organization workflow alerts into ordinary message unread counts.

### 2.6 Reactions, replies, and threads

The official public materials reviewed here document enterprise/group messaging, message synchronization, customer groups, meetings, documents, and file sharing, but do not expose a Slack-style thread model or a complete message-reaction specification. ([WeCom on Google Play](https://play.google.com/store/apps/details?gl=US&id=com.tencent.wework), [Tencent WeCom](https://www.tencent.com/products/wecom/))

For a faithful-but-original implementation, implement a neutral baseline—quote/reply metadata, emoji reactions, mentions, and group announcements—behind capabilities. Add a persistent thread panel only when the host data model exposes parent/reply relationships; this avoids inventing unsupported enterprise semantics while leaving room for a richer adapter.

### 2.7 Files, media, and collaborative artifacts

WeCom’s first-party listings describe collaborative documents and sheets, file storage, document sharing, and meetings with screen/document sharing. Tencent describes an enterprise platform that integrates work applications and customer communication. ([WeCom on Google Play](https://play.google.com/store/apps/details?gl=US&id=com.tencent.wework), [Tencent remote working and collaboration](https://www.tencent.com/products/remote-working-collaboration/))

The useful UI distinction is between an ephemeral media attachment, a shared file with permissions, and a durable collaborative document/sheet. Show ownership, access scope, file type, and collaboration status as separate metadata. Enterprise skins should prefer explicit permission and retention cues over purely visual thumbnails.

### 2.8 Calls and meetings

Official listings describe meetings with screen/document sharing, multi-person collaboration, and meeting-related features; the App Store listing also describes search and meeting/document capabilities. ([WeCom on Google Play](https://play.google.com/store/apps/details?gl=US&id=com.tencent.wework), [WeCom on the App Store](https://apps.apple.com/us/app/wecom-work-communication-tools/id1087897068))

Treat a meeting as a scheduled/work object that can be launched from a chat, not merely as a call bubble. A meeting card can expose time, participants, join state, agenda/document, screen-sharing state, recording/summary availability, and follow-up actions when supplied by the host.

### 2.9 Search

The official App Store listing describes global search across contacts, group chats, chat history, email, documents, and WeDrive, with filters for message or content categories. ([WeCom on the App Store](https://apps.apple.com/us/app/wecom-work-communication-tools/id1087897068))

This is a broad enterprise search model. Results should be typed and permission-aware: a contact, message, group, email, document, file, or meeting result needs a different preview and jump target. A skin should communicate when a result is outside the current chat and why it is visible.

### 2.10 Responsive/platform behavior

Tencent describes WeCom as a mobile work and enterprise platform, while official app listings cover mobile and tablet/desktop distribution and describe synchronized messaging, meetings, documents, and storage. ([Tencent remote working and collaboration](https://www.tencent.com/products/remote-working-collaboration/), [WeCom on the App Store](https://apps.apple.com/us/app/wecom-work-communication-tools/id1087897068), [WeCom on Google Play](https://play.google.com/store/apps/details?gl=US&id=com.tencent.wework))

The public sources do not publish a breakpoint-level responsive specification. An implementation should nevertheless use three modes: desktop with organization/list/chat/detail panes; tablet with a collapsible directory or detail pane; and mobile with one primary pane plus sheets for contact, file, meeting, and group administration. Preserve the same object model while changing pane visibility and navigation depth.

### 2.11 Distinctive interaction patterns

- **Enterprise-owned relationship:** customer communication is framed as an organizational asset, not only a personal chat. ([Tencent WeCom](https://www.tencent.com/products/wecom/))
- **Weixin interoperability:** internal enterprise communication and external/customer communication can connect to the Weixin ecosystem. ([Tencent WeCom](https://www.tencent.com/products/wecom/))
- **Chat plus operational surfaces:** directory, documents, meetings, drive, email, and office applications coexist. ([WeCom on Google Play](https://play.google.com/store/apps/details?gl=US&id=com.tencent.wework))
- **Permission and security as UI concerns:** Tencent foregrounds enterprise data protection and security certifications. ([Tencent WeCom](https://www.tencent.com/products/wecom/))
- **Global cross-work search:** contacts, groups, history, email, documents, and drive are all described as searchable. ([WeCom on the App Store](https://apps.apple.com/us/app/wecom-work-communication-tools/id1087897068))

---

## 3. DingTalk (钉钉)

### 3.1 Interaction model and information architecture

DingTalk presents itself as an integrated workspace combining secure chat, cloud documents, video meetings, calendars, mail, drive, attendance/approvals, and AI/work tools. ([DingTalk product overview](https://www.dingtalk.com/en), [DingTalk download](https://www.dingtalk.com/en/download))

Its feature page describes individual and group messaging, contacts, file sharing, collaboration, video conferencing, calendars, and other workplace services. ([DingTalk features](https://www.dingtalk.com/static/h5dingfeatures))

The resulting interaction model is a chat-centered enterprise super-app: a chat can be a communication stream, an entry point to a meeting/calendar event, and a route to a shared file or workflow. A skin should reflect this by giving chats stable relations to organizations, projects, meetings, and documents.

### 3.2 Visual/design language

DingTalk’s public product pages focus on integrated workplace capabilities and security/efficiency claims rather than publishing a component design system. The interface implication is a functional, task-oriented visual hierarchy: chat, contacts, work tools, meetings, and files need distinct but compatible categories. ([DingTalk product overview](https://www.dingtalk.com/en), [DingTalk features](https://www.dingtalk.com/static/h5dingfeatures))

This is an implementation inference, not a recommendation to copy DingTalk’s colors or iconography. Use an independent token system with clear semantic colors for unread, urgent, success, warning, and approval states.

### 3.3 Navigation and conversation list

DingTalk’s support and product pages describe group chats, contacts, DING alerts, meetings, documents, and organization-oriented functions. ([DingTalk support](https://www.dingtalk.com/static/support?wh_ttid=pc), [DingTalk product overview](https://www.dingtalk.com/en))

The conversation list should support personal chats, group/project chats, department chats, external contacts, and system/workflow conversations. Unlike a consumer-only list, rows may need a source/type label (person, group, department, project, approval, meeting) and an urgent marker distinct from ordinary unread.

### 3.4 Chat details and message composition

DingTalk’s official feature page lists text, voice, image, file, location, and business-card messaging, plus read/unread status. ([DingTalk features](https://www.dingtalk.com/static/h5dingfeatures))

Composition should therefore be multimodal and action-rich: text editor, voice recording, media/file picker, location/business-card cards, mentions, and meeting entry. Read status is a message-level state and should not be represented only by a conversation-level badge. ([DingTalk features](https://www.dingtalk.com/static/h5dingfeatures))

### 3.5 Presence, status, and notifications

The official materials reviewed describe read/unread status and DING urgent notifications. DING is a distinct urgency mechanism for important information, tasks, or meetings, rather than merely another unread count. ([DingTalk features](https://www.dingtalk.com/static/h5dingfeatures), [DingTalk support](https://www.dingtalk.com/static/support?wh_ttid=pc))

A skin should model `unread`, `read`, `mentioned`, and `urgent/DING` separately. A red dot or number is not enough to communicate urgency; show an explicit urgent treatment with accessible text and a clear delivery/acknowledgement state.

The public product pages do not provide a complete specification for online presence or typing indicators. Keep presence as an optional host capability rather than coupling it to read status.

### 3.6 Reactions, replies, and threads

DingTalk’s public support and feature pages document group chats, mentions, read status, DING, calls, files, and search, but the sources reviewed do not publish a full Slack-style thread/reaction interaction specification. ([DingTalk support](https://www.dingtalk.com/static/support?wh_ttid=pc), [DingTalk features](https://www.dingtalk.com/static/h5dingfeatures))

Implement quote/reply, mentions, and reactions as capability-backed message metadata. Keep replies discoverable from the parent, but do not assume every group message opens a separate channel-like thread unless the host adapter exposes that relation.

### 3.7 Files, media, and collaborative artifacts

DingTalk documents text/voice/image/file/location/business-card messages and describes Ding-Drive for file sharing and collaboration in company chats and with external contacts. ([DingTalk features](https://www.dingtalk.com/static/h5dingfeatures))

The product overview and docs pages also describe cloud documents and real-time collaborative editing for meeting notes, reports, and plans. ([DingTalk product overview](https://www.dingtalk.com/en), [DingTalk Docs](https://docs.dingtalk.com/product/doc))

A skin should render file attachments as structured cards with name, type, size, access, and collaboration actions. Distinguish a file message from a shared online document that has presence, comments, or edit state.

### 3.8 Calls and meetings

DingTalk’s meeting page describes calendar-based scheduling, reminders, invitations, launching meetings from individual or group chats, screen sharing, collaborative documents, whiteboards, captions, and AI summaries. ([DingTalk meetings](https://www.dingtalk.com/meeting?needMask=1))

The JSAPI explorer also exposes voice/video-related capabilities, including point-to-point video and quick-call functions. ([DingTalk JSAPI Explorer: audio/video](https://open.dingtalk.com/tools/explorer/jsapi?id=11652))

The interaction lesson is to make meetings first-class linked objects: a chat can create or launch a meeting, and a meeting can produce files, notes, captions, summaries, and follow-up tasks.

### 3.9 Search

DingTalk support describes platform-wide keyword search, and the product pages position contacts, chats, files, documents, and work tools inside one workspace. ([DingTalk support](https://www.dingtalk.com/static/support?wh_ttid=pc), [DingTalk product overview](https://www.dingtalk.com/en))

Use a global search entry with typed filters for messages, people, groups, files, documents, meetings, and work items. Search results should preserve organizational context—department, project, or external contact—so identical names do not become ambiguous.

### 3.10 Responsive/platform behavior

DingTalk publishes mobile/desktop downloads and describes an integrated workspace that spans chat, files, meetings, calendar, mail, and work tools. ([DingTalk download](https://www.dingtalk.com/en/download), [DingTalk product overview](https://www.dingtalk.com/en))

No public breakpoint specification was located in the cited material. Implement adaptive behavior by preserving task priority: desktop exposes organization/list/chat/detail panes; tablet keeps chat and meeting/file context side by side when space allows; mobile makes the conversation primary and pushes directory, meeting settings, files, and approvals into stacked routes or sheets.

### 3.11 Distinctive interaction patterns

- **DING urgency:** an explicit urgent delivery path for important messages, tasks, or meetings. ([DingTalk features](https://www.dingtalk.com/static/h5dingfeatures))
- **Read/unread messaging:** message-level acknowledgement is part of the product feature description. ([DingTalk features](https://www.dingtalk.com/static/h5dingfeatures))
- **Chat-launched meetings:** meetings can be scheduled or started from individual/group chats. ([DingTalk meetings](https://www.dingtalk.com/meeting?needMask=1))
- **Workplace super-app:** chats connect to calendar, documents, drive, mail, approvals, attendance, and AI work tools. ([DingTalk product overview](https://www.dingtalk.com/en))
- **Collaboration in the same object graph:** files, docs, screen sharing, whiteboards, captions, and meeting summaries can follow from a conversation. ([DingTalk meetings](https://www.dingtalk.com/meeting?needMask=1))

---

## 4. Telegram

### 4.1 Interaction model and information architecture

Telegram describes cloud-synchronized chats accessible on any number of phones, tablets, and computers. ([Telegram FAQ](https://telegram.org/faq))

Groups support large membership, granular administrators and permissions, pinned messages, moderation, anti-spam tools, and public links. Group topics divide a discussion into separate histories with shared media and notification settings. ([Telegram FAQ](https://telegram.org/faq))

Telegram’s broader model includes private chats, groups, channels, saved messages, folders, and topics. The official FAQ and API documentation make topics and folders explicit, while the search API models messages, saved messages, threads, media types, documents, phone calls, and folder filters. ([Telegram FAQ](https://telegram.org/faq), [Telegram search API](https://core.telegram.org/api/search), [Telegram methods](https://core.telegram.org/methods))

**Skin implication.** Telegram-like navigation is contact/list-centric but highly filterable. Model chat folders and topics as first-class navigation state rather than treating them as arbitrary labels.

### 4.2 Visual/design language

Telegram’s official homepage and FAQ emphasize cloud access, privacy/security, groups, customization, and cross-device use. ([Telegram homepage](https://telegram.org/), [Telegram FAQ](https://telegram.org/faq))

The public sources do not publish a full design-token reference. A defensible original interpretation is lightweight, content-forward, and customization-friendly: prioritize fast scanning of a chat list, clear media previews, and compact controls, but use independent tokens and icons rather than reproducing Telegram’s visual identity.

### 4.3 Navigation and conversation list

The primary list is organized around private chats, groups, and channels; folders can filter or partition the list. Telegram’s API includes folder filtering and global search, and the FAQ documents synced access across devices. ([Telegram FAQ](https://telegram.org/faq), [Telegram search API](https://core.telegram.org/api/search))

A skin should let a user switch between an all-chat list and named/custom folders, while retaining unread counts and pinned items. A folder is a view over conversations, not a duplicated conversation object.

### 4.4 Chat details and message composition

Telegram supports text, photos, videos, and files of any type; the FAQ states a 2 GB per-file limit, or 4 GB with Premium, and explains that cloud media can remain available while local cache is cleared. ([Telegram FAQ](https://telegram.org/faq))

The composer therefore needs a broad attachment affordance and a clear upload/download/cache state. Voice messages and one-time voice/video messages are documented in official Telegram updates. ([Telegram FAQ](https://telegram.org/faq), [Telegram upgraded search and messages](https://telegram.org/blog/new-saved-messages-and-9-more))

### 4.5 Presence, status, and notifications

Telegram’s FAQ documents online/last-seen privacy behavior and read states, while group topics have separate notification settings. ([Telegram FAQ](https://telegram.org/faq))

Presence should be privacy-aware: distinguish visible online, hidden/last-seen, recently active, and unavailable-to-view. Notification state should exist at chat, folder, and topic levels because the topic model explicitly allows separate notification settings. ([Telegram FAQ](https://telegram.org/faq))

### 4.6 Reactions, replies, and topics

Telegram’s API documents sending/retrieving reactions, reaction limits, unread reactions, and reaction reporting. ([Telegram reactions API](https://core.telegram.org/api/reactions))

Topics act as separate discussion histories within a group and are analogous to lightweight threads with their own media and notification context. The API also supports searching threads and topic-related content. ([Telegram FAQ](https://telegram.org/faq), [Telegram search API](https://core.telegram.org/api/search))

Saved-message reactions can be used as tags and searched using `saved_reaction`, demonstrating that reactions can become retrieval metadata rather than only decoration. ([Telegram saved messages](https://core.telegram.org/api/saved-messages))

### 4.7 Files and media

Telegram’s official FAQ states that users can send photos, videos, and files of any type, with cloud storage behavior and large per-file limits. ([Telegram FAQ](https://telegram.org/faq))

The search API supports file/document filters and global document search, so files are both conversation content and searchable objects. ([Telegram search API](https://core.telegram.org/api/search))

A skin should make media type, cache status, download progress, and origin chat visible. Avoid treating all media as an inline image; document, audio, video, location, and call-history results need distinct cards.

### 4.8 Calls

Telegram documents one-to-one end-to-end encrypted voice and video calls and group calls supporting up to 200 participants. It also documents comments and reactions inside group calls without interrupting audio. ([Telegram FAQ](https://telegram.org/faq), [Telegram comments and reactions in group calls](https://telegram.org/blog/comments-in-video-chats-threads-for-bots/))

The call UI should separate transport state (connecting, connected, muted, camera, screen sharing) from in-call social state (comments/reactions). A post-call message/history item can remain searchable because phone-call history is represented in the search API. ([Telegram search API](https://core.telegram.org/api/search))

### 4.9 Search

Telegram offers instant search across large histories, with filters by sender, media, files, links, voice messages, call history, and folders. Its `messages.search` method can search within chats, saved messages, threads, by sender/date, reaction tags, and media type. ([Telegram FAQ](https://telegram.org/faq), [Telegram search API](https://core.telegram.org/api/search), [Telegram `messages.search`](https://core.telegram.org/method/messages.search))

Search is therefore a core navigation system. The UI should support scoped search (current chat/topic), global search, and structured filters without losing the jump target.

### 4.10 Responsive/platform behavior

Telegram’s cloud-chat promise explicitly spans phones, tablets, and computers with simultaneous access and instant synchronization. ([Telegram FAQ](https://telegram.org/faq))

A faithful original responsive model should keep conversation identity and message history stable across platforms while adapting layout: multi-pane list/chat/detail on desktop/tablet, one-pane chat with a back route on mobile, and consistent attachment/upload/cache state everywhere. The product’s cloud model makes synchronization state an important part of the UI, not just a backend detail. ([Telegram FAQ](https://telegram.org/faq))

### 4.11 Distinctive interaction patterns

- **Cloud-first, multi-device history:** the same chat is available across phones, tablets, and computers. ([Telegram FAQ](https://telegram.org/faq))
- **Folders:** a user-defined view over chats. ([Telegram search API](https://core.telegram.org/api/search))
- **Topics:** separate histories, media, and notification settings inside a group. ([Telegram FAQ](https://telegram.org/faq))
- **Reactions as retrieval metadata:** saved-message reactions can function as searchable tags. ([Telegram saved messages](https://core.telegram.org/api/saved-messages))
- **Rich typed search:** files, calls, media, senders, dates, threads, folders, and reaction tags. ([Telegram search API](https://core.telegram.org/api/search))
- **In-call comments/reactions:** participation without interrupting audio. ([Telegram comments and reactions in group calls](https://telegram.org/blog/comments-in-video-chats-threads-for-bots/))

---

## 5. WhatsApp

### 5.1 Interaction model and information architecture

WhatsApp’s official features material presents messaging, group communication, calls, Status, Communities, Channels, and multi-device use as adjacent parts of the product. ([WhatsApp features](https://www.whatsapp.com/features), [WhatsApp homepage](https://www.whatsapp.com/))

The dominant object remains the private or group chat, with broadcast/community surfaces layered alongside it. WhatsApp’s official product announcements describe Communities as a way to organize related groups and Channels as a broadcast-style feed for updates from organizations and creators. ([WhatsApp Communities](https://www.whatsapp.com/communities), [WhatsApp Channels](https://www.whatsapp.com/channels), [WhatsApp blog](https://blog.whatsapp.com/))

A skin should preserve the contact-centric feel: recent chats are the fast path, while calls, status, communities, and channels are sibling destinations rather than nested workspace administration.

### 5.2 Visual/design language

WhatsApp’s public product pages emphasize private communication, simplicity, multi-device access, calls, and media rather than publishing a public component/design-token system. ([WhatsApp features](https://www.whatsapp.com/features), [WhatsApp privacy](https://www.whatsapp.com/privacy))

The safe design inference is a low-friction, content-forward messenger: the conversation surface should dominate, controls should be recognizable and compact, and privacy/transport states should be legible. This is an inference from the product’s public feature framing, not a prescription to copy WhatsApp’s palette, typography, icons, or exact geometry. ([WhatsApp features](https://www.whatsapp.com/features))

### 5.3 Navigation and conversation list

The official features page and announcements expose Chats, Calls, Status, Communities, and Channels as distinct product surfaces. ([WhatsApp features](https://www.whatsapp.com/features), [WhatsApp Channels](https://www.whatsapp.com/channels))

The chat list should optimize recency and unread scanning: avatar/contact identity, last message preview, time, mute/archive/pin state, and unread marker. Calls and broadcast/community feeds should not be represented as ordinary one-to-one chat rows; give them their own navigation category and item type.

### 5.4 Chat details and message composition

WhatsApp’s official features material describes messaging with photos, videos, documents, voice messages, and location/contact-style content, while its official updates continue to document message reactions and media/call features. ([WhatsApp features](https://www.whatsapp.com/features), [WhatsApp blog](https://blog.whatsapp.com/))

The composer should remain lightweight but multimodal: text input, emoji/sticker or reaction access, camera/media, document, voice recording, and call shortcuts. The message timeline should support reply/quote context and delivery/read states as metadata rather than requiring large bubble variations.

### 5.5 Presence, status, and notifications

WhatsApp describes Status as an adjacent way to share updates, and its privacy material explains that users control what they share and with whom. ([WhatsApp features](https://www.whatsapp.com/features), [WhatsApp privacy](https://www.whatsapp.com/privacy))

The public pages reviewed do not provide a complete UI specification for online presence, typing indicators, or every notification state. An original skin should nevertheless separate `message delivery`, `read`, `muted`, `archived`, `status update`, `call`, and `community/channel` notifications. Avoid using one generic red badge for all of these.

### 5.6 Reactions, replies, and threads

WhatsApp’s official updates document emoji reactions to messages, while Communities organize related groups rather than turning every message into a persistent Slack-style thread. ([WhatsApp blog](https://blog.whatsapp.com/), [WhatsApp Communities](https://www.whatsapp.com/communities))

The baseline UI should support reactions and quoted replies in the message row, with a compact reaction summary and a jump-to-parent affordance. A thread drawer can be a capability, but it should not be forced on a consumer-chat skin unless the underlying conversation data explicitly supplies thread membership.

### 5.7 Files and media

WhatsApp’s official features page documents sharing photos, videos, documents, voice messages, and other media, and official updates describe continuing improvements to media and document handling. ([WhatsApp features](https://www.whatsapp.com/features), [WhatsApp blog](https://blog.whatsapp.com/))

Media is part of the conversation’s primary flow, so use inline previews for images/video, compact cards for documents, and obvious upload/download/forward/share states. Keep original media dimensions and cropping independent from the chat bubble geometry so the skin can use its own visual language.

### 5.8 Calls

WhatsApp’s official features page describes voice and video calls, group calls, screen sharing, HD video, call links, and end-to-end encryption for calls. ([WhatsApp features](https://www.whatsapp.com/features))

The official feature description also says group calls can be started from chats or from the Calls tab, and that calls support up to 32 participants with no duration limit on supported devices. ([WhatsApp features](https://www.whatsapp.com/features))

A skin should provide both contextual call actions in a chat header and a global Calls destination. During a call, expose participant state, mute/camera/screen-share controls, and privacy/connection status without borrowing proprietary call icons.

### 5.9 Search

WhatsApp’s official help-center materials provide search entry points for chats/messages and media/document categories, while the features page frames chats and shared media as core content. ([WhatsApp Help Center](https://faq.whatsapp.com/), [WhatsApp features](https://www.whatsapp.com/features))

Implement current-chat search and global search as separate scopes. Typed filters for photos, videos, links, documents, and audio are useful because they match the product’s media-rich history, but retain the originating chat and date in each result.

### 5.10 Responsive/platform behavior

WhatsApp documents linked devices and use across supported phones, web, and desktop experiences; the feature set is intended to preserve private conversations across those surfaces. ([WhatsApp features](https://www.whatsapp.com/features), [WhatsApp Help Center](https://faq.whatsapp.com/1324084875126592/))

Responsive behavior should be contact-centric: desktop/web can use a persistent chat list beside the current conversation; tablet can use a split view; mobile uses one conversation at a time with bottom or top navigation for Chats, Calls, Status, Communities, or Channels. Keep the composer anchored to the visual viewport and ensure media previews do not trap the back gesture.

### 5.11 Distinctive interaction patterns

- **Recency-first chat list:** the private/group conversation is the primary object; adjacent surfaces handle calls, status, communities, and channels. ([WhatsApp features](https://www.whatsapp.com/features))
- **Communities:** related groups are organized under a broader community structure. ([WhatsApp Communities](https://www.whatsapp.com/communities))
- **Channels:** broadcast-style updates are separated from two-way chats. ([WhatsApp Channels](https://www.whatsapp.com/channels))
- **In-chat media richness:** photos, video, documents, voice, and location are routine message types. ([WhatsApp features](https://www.whatsapp.com/features))
- **Contextual and global calls:** calls can start from a chat or Calls area. ([WhatsApp features](https://www.whatsapp.com/features))
- **Privacy as a visible contract:** WhatsApp highlights end-to-end encryption and user control over sharing. ([WhatsApp privacy](https://www.whatsapp.com/privacy))

---

## 6. Cross-product comparison

| Dimension | Slack | WeCom | DingTalk | Telegram | WhatsApp |
|---|---|---|---|---|---|
| Primary unit | Workspace/channel/DM | Enterprise directory + internal/external chat | Enterprise chat + workplace tools | Private/group/channel chat | Private/group chat |
| Secondary structure | Threads, activity, canvases | Customers, departments, apps, documents, meetings | Departments/projects, DING, docs, meetings, approvals | Folders, topics, saved messages | Communities, channels, Status |
| Unread/attention grammar | Activity inbox, mentions, reactions, thread state, Bloops | Enterprise/workflow events should be distinct; public UI spec is limited | Read/unread plus urgent DING | Chat/topic/folder notifications and unread reactions | Delivery/read plus chat/status/community/channel notifications |
| Reply model | Explicit parent message + thread | Capability-dependent; public sources reviewed do not specify Slack-like threads | Capability-dependent; public sources reviewed do not specify full thread model | Topics and replies; rich thread/topic search | Quoted replies; communities are not per-message threads |
| Reaction model | Emoji reactions on messages/collaborative surfaces | Public source coverage is limited | Public source coverage is limited | API-level reactions and searchable saved-reaction tags | Emoji reactions on messages |
| File/artifact model | Files plus durable canvases | Files, drive, collaborative docs/sheets | Files/drive plus cloud docs and meeting artifacts | Cloud media/files, searchable by type | Media/documents primarily embedded in chats |
| Call model | Conversation-attached huddles with screen sharing, thread, notes | Enterprise meetings with document/screen collaboration | Scheduled/chat-launched meetings, whiteboard, captions, summaries | Private E2E calls and large group calls; in-call comments/reactions | Chat or Calls tab; voice/video, screen share, group calls |
| Search model | Messages, files, channels, people, canvases | Enterprise-wide contacts, groups, history, email, docs, drive | Platform-wide keyword search across workplace objects | Global/in-chat typed search, threads, files, calls, folders, reactions | Chat/global search with media/document categories |
| Desktop/tablet/mobile principle | Dense multi-pane workspace -> split tablet -> focused mobile tabs | Organization/work surfaces -> collapsible context -> one-pane mobile | Workspace/task panes -> split tablet -> chat-first mobile | Multi-device cloud list/chat/detail -> one-pane mobile | Persistent chat list on web -> split tablet -> one-chat mobile |
| Distinctive pattern | Bloops/Peeks and attention-in-place | Enterprise-owned customer relationship | DING urgency and chat-launched work | Folders/topics and search depth | Communities/channels beside recency-first chats |

Sources for the comparison are the product-specific sources above, especially Slack’s design and help pages, Tencent’s WeCom pages and app listings, DingTalk’s feature/support/meeting pages, Telegram’s FAQ/API pages, and WhatsApp’s features/privacy pages.

### 6.1 Shared interaction primitives

Across all five products, a robust chat skin benefits from these primitives:

- **Conversation identity:** participant/group/organization context, avatar or generic identity mark, and a stable route.
- **Message envelope:** sender, timestamp, delivery/read state, text/media/artifact payload, reactions, reply/quote metadata, and optional thread/topic parent.
- **Attention event:** unread, mention, reaction, reply, urgent, call, workflow, status, or channel/community update; each should be independently filterable.
- **Attachment/artifact:** preview, type, size, permission/access, progress, and jump/open action.
- **Call/meeting state:** participants, connection, controls, and durable post-call event or notes.
- **Search result:** typed object, origin conversation/workspace, timestamp, permissions, and jump target.

These primitives are supported by Slack’s explicit message surfaces/activity/thread model, Telegram’s typed search/reaction APIs, and the enterprise products’ documented directories, documents, meetings, files, and workflow surfaces. ([Slack surfaces](https://docs.slack.dev/surfaces/), [Slack Activity view](https://slack.com/help/articles/19693583638803-Get-your-work-done-from-the-Activity-view), [Telegram search API](https://core.telegram.org/api/search), [Tencent WeCom](https://www.tencent.com/products/wecom/), [DingTalk product overview](https://www.dingtalk.com/en))

### 6.2 Key differences to preserve

1. **Workspace navigation versus recency navigation.** Slack, WeCom, and DingTalk need organization/work context; Telegram and WhatsApp need a fast recent-chat path. Do not use one universal sidebar treatment for all skins. ([Slack quick start](https://slack.com/help/articles/360059928654-How-to-use-Slack--your-quick-start-guide), [Tencent WeCom](https://www.tencent.com/products/wecom/), [DingTalk features](https://www.dingtalk.com/static/h5dingfeatures), [Telegram FAQ](https://telegram.org/faq), [WhatsApp features](https://www.whatsapp.com/features))
2. **Thread semantics versus quote semantics.** Slack’s thread is an explicit subordinate stream; Telegram topics divide group histories; WhatsApp’s core interaction is closer to a direct chat with quoted replies; public WeCom/DingTalk sources reviewed here do not provide a complete equivalent specification. ([Slack threads](https://slack.com/help/articles/115000769927-Use-threads-to-organize-discussions-), [Telegram FAQ](https://telegram.org/faq), [WhatsApp features](https://www.whatsapp.com/features))
3. **Urgency semantics.** DingTalk’s DING is not interchangeable with a generic unread badge, while Slack’s activity/Bloops and Telegram’s topic notification settings imply more nuanced attention state. ([DingTalk features](https://www.dingtalk.com/static/h5dingfeatures), [A new visual language for Slack](https://slack.design/articles/a-new-visual-language-for-slack/), [Telegram FAQ](https://telegram.org/faq))
4. **Artifacts.** Slack canvases, WeCom documents/drive, and DingTalk docs/drive are durable work objects; Telegram and WhatsApp primarily expose files and media in chat, though their histories remain searchable. ([Slack canvas](https://slack.com/help/articles/203950418-Use-a-canvas-in-Slack), [WeCom on Google Play](https://play.google.com/store/apps/details?gl=US&id=com.tencent.wework), [DingTalk Docs](https://docs.dingtalk.com/product/doc), [Telegram FAQ](https://telegram.org/faq), [WhatsApp features](https://www.whatsapp.com/features))
5. **Call attachment.** Slack huddles and DingTalk meetings are strongly tied to work context; Telegram and WhatsApp support direct/group calling from messenger surfaces; WeCom exposes enterprise meeting/document collaboration. ([Slack huddles](https://slack.com/help/articles/4402059015315-Use-huddles-in-Slack), [DingTalk meetings](https://www.dingtalk.com/meeting?needMask=1), [Telegram FAQ](https://telegram.org/faq), [WhatsApp features](https://www.whatsapp.com/features), [WeCom on Google Play](https://play.google.com/store/apps/details?gl=US&id=com.tencent.wework))

---

## 7. Actionable guidance for faithful-but-original ChatLab skins

### 7.1 Implement a shared semantic model, then skin the projection

Use a common host model with capability flags rather than five divergent DOM structures. Suggested capabilities include:

```text
conversationKinds: direct | group | channel | topic | customer | department | project
replyKinds: quote | thread | topic | none
attentionKinds: unread | mention | reaction | reply | urgent | call | workflow | status
artifactKinds: image | video | audio | file | document | canvas | meeting | link
callKinds: voice | video | huddle | meeting | groupCall
searchScopes: currentConversation | workspace | organization | global
presenceKinds: online | away | customStatus | lastSeen | unavailable
```

This separation follows the differences documented in Slack’s threads/activity/canvases, Telegram’s topics/folders/search filters, WeCom/DingTalk’s enterprise artifacts and urgent work, and WhatsApp’s chat/community/channel split. ([Slack threads](https://slack.com/help/articles/115000769927-Use-threads-to-organize-discussions-), [Slack canvas](https://slack.com/help/articles/203950418-Use-a-canvas-in-Slack), [Telegram search API](https://core.telegram.org/api/search), [Tencent WeCom](https://www.tencent.com/products/wecom/), [DingTalk features](https://www.dingtalk.com/static/h5dingfeatures), [WhatsApp features](https://www.whatsapp.com/features))

### 7.2 Preserve interaction grammar, not branded appearance

**Safe to borrow as generic interaction patterns:**

- A three-pane desktop chat workspace.
- A recent-chat list with unread/mention markers.
- A parent message opening a reply/thread view.
- Emoji reaction summaries.
- Typed search results with jump-to-message.
- Inline image/file cards.
- A call/meeting state attached to a conversation.
- Mobile navigation that collapses secondary panes into routes or sheets.

**Do not copy:**

- Company logos, wordmarks, mascots, names, or trademarked labels such as brand-specific urgency names.
- Proprietary icon glyphs, illustrations, avatars, stickers, or exact brand palettes.
- Exact screenshots, pixel-identical geometry, or a distinctive combination of brand-specific colors, typography, and navigation labels.
- Vendor-specific backend behavior that is not represented in ChatLab’s host data.

Use neutral labels such as `Urgent`, `Attention`, `Workspace`, `Directory`, `Topic`, `Artifact`, and `Call` unless a skin is explicitly a fictional interpretation with its own vocabulary.

### 7.3 Make unread state a typed event system

Do not render all attention as a red dot. Model and style separately:

- ordinary unread message;
- mention or direct address;
- thread/reply activity;
- reaction activity;
- urgent delivery/acknowledgement;
- meeting/call invitation;
- file/document update;
- community/channel broadcast;
- customer or workflow follow-up.

This reflects Slack’s activity/Bloop model, DingTalk’s DING distinction, Telegram’s topic notification settings, and the enterprise products’ multiple work surfaces. ([A new visual language for Slack](https://slack.design/articles/a-new-visual-language-for-slack/), [Slack Activity view](https://slack.com/help/articles/19693583638803-Get-your-work-done-from-the-Activity-view), [DingTalk features](https://www.dingtalk.com/static/h5dingfeatures), [Telegram FAQ](https://telegram.org/faq))

### 7.4 Treat responsive design as information architecture

Define explicit layout modes rather than only CSS breakpoints:

- **Wide desktop:** navigation rail + conversation list + message stream + optional thread/detail panel.
- **Tablet:** conversation list and stream remain split when possible; detail/thread becomes an overlay or collapsible pane.
- **Mobile:** one primary route; list, chat, thread, files, contact details, and meeting details are separate screens/sheets; composer stays anchored to the keyboard-safe viewport.

Slack’s iPad/mobile design articles, Telegram’s multi-device model, and the cross-platform app listings for WeCom, DingTalk, and WhatsApp support this approach. ([Slack on iPad](https://slack.design/articles/how-we-redesigned-slack-for-the-ipad/), [Slack mobile redesign](https://slack.design/articles/re-designing-slack-on-mobile/), [Telegram FAQ](https://telegram.org/faq), [WeCom on the App Store](https://apps.apple.com/us/app/wecom-work-communication-tools/id1087897068), [DingTalk download](https://www.dingtalk.com/en/download), [WhatsApp features](https://www.whatsapp.com/features))

### 7.5 Separate artifacts from message bubbles

Render an image, video, file, document, canvas, meeting, and call-history item as semantic cards with their own actions. This is particularly important for Slack canvases, WeCom/DingTalk collaborative documents, Telegram’s typed file search, and WhatsApp’s media-rich chats. ([Slack canvas](https://slack.com/help/articles/203950418-Use-a-canvas-in-Slack), [WeCom on Google Play](https://play.google.com/store/apps/details?gl=US&id=com.tencent.wework), [DingTalk Docs](https://docs.dingtalk.com/product/doc), [Telegram search API](https://core.telegram.org/api/search), [WhatsApp features](https://www.whatsapp.com/features))

### 7.6 Keep presence, delivery, and privacy independent

A person may be online but have notifications muted; a message may be delivered but unread; a last-seen value may be hidden; a customer or external identity may require organization context. Slack documents status/availability separately from notifications, Telegram documents privacy-aware online/last-seen behavior, and WhatsApp foregrounds privacy controls. ([Slack status and availability](https://slack.com/help/articles/205240127-Set-your-Slack-status-and-availability), [Slack notifications](https://slack.com/help/articles/360025446073-Guide-to-Slack-notifications), [Telegram FAQ](https://telegram.org/faq), [WhatsApp privacy](https://www.whatsapp.com/privacy))

### 7.7 Use capability-driven fallbacks

When the host cannot supply a feature, degrade gracefully:

- no threads: show quote/reply metadata, not a fake thread count;
- no presence: omit the dot rather than display stale presence;
- no reactions: hide the reaction affordance while preserving text;
- no typed search: keep a simple search box and a stable jump target;
- no call state: show a generic call action, not fabricated participants or connection status;
- no document permissions: render a file card without implying edit access.

This is especially important for WeCom and DingTalk, where public pages describe broad capabilities but do not expose every UI-level behavior, and for WhatsApp where public feature pages do not specify every presence/notification detail. ([Tencent WeCom](https://www.tencent.com/products/wecom/), [DingTalk support](https://www.dingtalk.com/static/support?wh_ttid=pc), [WhatsApp Help Center](https://faq.whatsapp.com/))

### 7.8 Validate with interaction tests, not visual resemblance alone

For each skin, test the following flows:

1. Open a conversation from an unread/mention/urgent list row and return without losing scroll position.
2. Reply to a message, open the parent from the reply view, and preserve reaction state.
3. Attach an image, document, and link; verify preview, upload, error, and retry states.
4. Search globally and within the current conversation; jump to a result and preserve query/filter state.
5. Start or join a call/meeting; show connecting, active, muted, screen-sharing, and ended states.
6. Switch wide desktop, tablet, and mobile modes while retaining the same conversation and draft.
7. Verify that identity context distinguishes internal, external/customer, department, group, and channel conversations.

These tests exercise the common primitives and the product-specific differences described in this report without requiring proprietary visual assets.

---

## 8. Source index and evidence notes

### Slack

- [Slack Design — A new visual language for Slack](https://slack.design/articles/a-new-visual-language-for-slack/)
- [Slack blog — A redesigned Slack, built for focus](https://slack.com/blog/productivity/a-redesigned-slack-built-for-focus)
- [Slack Design — How we redesigned Slack for the iPad](https://slack.design/articles/how-we-redesigned-slack-for-the-ipad/)
- [Slack Design — Re-designing Slack on Mobile](https://slack.design/articles/re-designing-slack-on-mobile/)
- [Slack Help — Quick-start guide](https://slack.com/help/articles/360059928654-How-to-use-Slack--your-quick-start-guide)
- [Slack Help — Use threads](https://slack.com/help/articles/115000769927-Use-threads-to-organize-discussions-)
- [Slack Help — Notifications](https://slack.com/help/articles/360025446073-Guide-to-Slack-notifications)
- [Slack Help — Status and availability](https://slack.com/help/articles/205240127-Set-your-Slack-status-and-availability)
- [Slack Help — Emoji and reactions](https://slack.com/help/articles/202931348-Use-emoji-and-reactions)
- [Slack Help — Huddles](https://slack.com/help/articles/4402059015315-Use-huddles-in-Slack)
- [Slack Help — Canvas](https://slack.com/help/articles/203950418-Use-a-canvas-in-Slack)
- [Slack Help — Files](https://slack.com/help/articles/360057449973-Manage-files-in-Slack)
- [Slack Help — Activity view](https://slack.com/help/articles/19693583638803-Get-your-work-done-from-the-Activity-view)
- [Slack Help — Simplified layout](https://slack.com/help/articles/41214514885907-Use-simplified-layout-mode-in-Slack)
- [Slack Developer Docs — Surfaces](https://docs.slack.dev/surfaces/)
- [Slack Developer Docs — Block Kit](https://docs.slack.dev/block-kit/)

### WeCom / 企业微信

- [Tencent — WeCom product overview](https://www.tencent.com/products/wecom/)
- [Tencent — WeCom Chinese overview](https://www.tencent.com/zh-cn/products/wecom/)
- [Tencent — Remote working and collaboration](https://www.tencent.com/products/remote-working-collaboration/)
- [WeCom — Google Play listing](https://play.google.com/store/apps/details?gl=US&id=com.tencent.wework)
- [WeCom — Apple App Store listing](https://apps.apple.com/us/app/wecom-work-communication-tools/id1087897068)
- [WeCom developer documentation](https://developer.work.weixin.qq.com/)

The Tencent pages are primary corporate material; the App Store/Google Play entries are first-party product listings and release metadata. The report deliberately marks detailed presence/thread/reaction claims as evidence gaps where the public sources reviewed do not specify them.

### DingTalk / 钉钉

- [DingTalk — Product overview](https://www.dingtalk.com/en)
- [DingTalk — Features](https://www.dingtalk.com/static/h5dingfeatures)
- [DingTalk — Support](https://www.dingtalk.com/static/support?wh_ttid=pc)
- [DingTalk — Download](https://www.dingtalk.com/en/download)
- [DingTalk — Meetings](https://www.dingtalk.com/meeting?needMask=1)
- [DingTalk Docs — Product page](https://docs.dingtalk.com/product/doc)
- [DingTalk Open Platform — Group API overview](https://open.dingtalk.com/document/isvapp/group-api-overview)
- [DingTalk JSAPI Explorer — Audio/video](https://open.dingtalk.com/tools/explorer/jsapi?id=11652)

The official feature/support pages are the strongest sources for the user-visible message, DING, read status, files, calls, and search claims. The open-platform pages support the existence of group/API and audio/video capabilities; they are not treated as a complete visual specification.

### Telegram

- [Telegram FAQ](https://telegram.org/faq)
- [Telegram homepage](https://telegram.org/)
- [Telegram official blog](https://telegram.org/blog)
- [Telegram API overview](https://core.telegram.org/)
- [Telegram reactions API](https://core.telegram.org/api/reactions)
- [Telegram search API](https://core.telegram.org/api/search)
- [Telegram `messages.search`](https://core.telegram.org/method/messages.search)
- [Telegram saved messages](https://core.telegram.org/api/saved-messages)
- [Telegram API method index](https://core.telegram.org/methods)
- [Telegram comments/reactions in group calls](https://telegram.org/blog/comments-in-video-chats-threads-for-bots/)

Telegram’s FAQ and API documentation provide unusually detailed, first-party behavioral evidence for folders, topics, reactions, search filters, files, calls, and synchronization.

### WhatsApp

- [WhatsApp features](https://www.whatsapp.com/features)
- [WhatsApp homepage](https://www.whatsapp.com/)
- [WhatsApp privacy](https://www.whatsapp.com/privacy)
- [WhatsApp Communities](https://www.whatsapp.com/communities)
- [WhatsApp Channels](https://www.whatsapp.com/channels)
- [WhatsApp official blog](https://blog.whatsapp.com/)
- [WhatsApp Help Center](https://faq.whatsapp.com/)
- [WhatsApp Help — linked devices](https://faq.whatsapp.com/1324084875126592/)

WhatsApp’s public features/privacy pages are authoritative for broad product capabilities and privacy positioning. The report avoids inventing undocumented presence, notification, or thread details and identifies those areas as capability-dependent.

---

## 9. Limitations

- Public vendor materials are uneven. Slack and Telegram publish detailed design/API/help material; WeCom, DingTalk, and WhatsApp publish broad product capabilities but fewer public UI specifications.
- Product behavior changes frequently. The report records the behavior described by the linked sources and should be rechecked before shipping a skin intended to track a particular version.
- A feature documented by an API does not guarantee that every client renders it in the same way. API facts are used here to identify durable interaction objects, not to claim pixel-level client behavior.
- Visual observations are intentionally expressed as principles or implementation inferences unless a first-party design source explicitly describes them.
