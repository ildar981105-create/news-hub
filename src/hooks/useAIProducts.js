import { useState, useEffect, useCallback } from 'react';

/**
 * 热门 AI 产品数据库
 * 筛选标准：1万+用户、近期活跃、有明确产品形态
 * 分类：LLM 大模型 / 图像生成 / 视频生成 / 编程助手 / 设计工具 / AI Agent / 效率工具 / 搜索引擎 / 音频语音
 */
const AI_PRODUCTS = [
  // ===== AI Agent =====
  {
    id: 'openclaw',
    name: 'OpenClaw',
    company: 'Peter Steinberger',
    url: 'https://github.com/nicepkg/openclaw',
    icon: '🦞',
    category: 'AI Agent',
    description: '开源个人 AI 助手，2天GitHub Star破10万，一个助手统一管理 WhatsApp、Telegram、微信、飞书等10+平台消息，支持多模型切换',
    users: '100K+ Stars',
    isNew: true,
    isHot: true,
    tags: ['开源', '多平台', '智能体', '私有部署'],
    trendScore: 99,
    whyHot: '2天GitHub Star破10万，创GitHub历史最快增长纪录。核心卖点：①一个助手管所有聊天平台（微信/飞书/Telegram等10+）；②支持Claude/GPT/Gemini/本地模型自由切换；③2GB内存即可私有部署，完全免费开源（MIT协议）；④不仅聊天，还能操作系统、处理邮件、整理文件。被网友戏称为"小龙虾"（因图标是红色龙虾），甚至衍生出"500元上门安装OpenClaw"的热梗。',
    trendChange: '+580%',
    trendReason: 'GitHub史上最快开源项目，私有AI助手刚需爆发',
  },

  // ===== LLM 大模型 =====
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    company: 'OpenAI',
    url: 'https://chat.openai.com',
    icon: 'https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg',
    category: 'LLM 大模型',
    description: '全球最流行的 AI 对话助手，支持 GPT-4o、o1 推理模型',
    users: '300M+',
    isNew: false,
    isHot: true,
    tags: ['对话', '写作', '编程', '多模态'],
    trendScore: 95,
    whyHot: '全球用户量最大的AI产品（3亿+），Deep Research功能引领"AI深度研究"新范式，语音交互体验远超竞品，Agent模式让AI真正能帮你执行浏览器操作任务。',
    trendChange: '+12%',
    trendReason: 'Deep Research + Agent模式双管齐下',
  },
  {
    id: 'claude',
    name: 'Claude',
    company: 'Anthropic',
    url: 'https://claude.ai',
    icon: 'https://claude.ai/favicon.ico',
    category: 'LLM 大模型',
    description: '以安全和长文本处理著称的 AI 助手，支持 200K token 上下文',
    users: '40M+',
    isNew: false,
    isHot: true,
    tags: ['对话', '长文本', '编程', '分析'],
    trendScore: 92,
    whyHot: '写作和编程领域公认天花板。Claude能精准模仿你的写作风格，代码遵循指令能力极强。Artifacts功能让对话直接产出可交互内容，MCP协议成为AI工具链标准。',
    trendChange: '+25%',
    trendReason: 'Claude 4发布，MCP协议成行业标准',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    company: 'Google',
    url: 'https://gemini.google.com',
    icon: 'https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png',
    category: 'LLM 大模型',
    description: 'Google 的多模态大模型，深度整合搜索和 Google 生态',
    users: '200M+',
    isNew: false,
    isHot: true,
    tags: ['多模态', '搜索', '对话'],
    trendScore: 88,
    whyHot: '多模态能力最强选手，Veo3视频生成吊打Sora，与Google全家桶深度整合。免费版就很能打，NotebookLM把文档变播客的功能破圈传播。',
    trendChange: '+18%',
    trendReason: 'Veo3视频生成 + NotebookLM破圈',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    company: 'DeepSeek',
    url: 'https://chat.deepseek.com',
    icon: 'https://chat.deepseek.com/favicon.ico',
    category: 'LLM 大模型',
    description: '国产开源大模型黑马，推理能力强，DeepSeek-R1 引发行业震动',
    users: '50M+',
    isNew: false,
    isHot: true,
    tags: ['开源', '推理', '编程', '数学'],
    trendScore: 90,
    whyHot: '以极低成本训练出比肩GPT-4o的模型，R1推理模型让"思维链"从概念变为现实。完全开源+API价格仅为OpenAI的1/10，被称为"AI界的拼多多"，引发全球关注。',
    trendChange: '+45%',
    trendReason: '开源模型性价比之王，R1推理震动行业',
  },
  {
    id: 'doubao',
    name: '豆包',
    company: '字节跳动',
    url: 'https://www.doubao.com',
    icon: 'https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/logo-icon-white-bg.png',
    category: 'LLM 大模型',
    description: '字节跳动旗下 AI 助手，国内用户量最大的 AI 对话产品之一',
    users: '80M+',
    isNew: false,
    isHot: true,
    tags: ['对话', '写作', '创作'],
    trendScore: 82,
    whyHot: '国内用户量最大的AI对话产品之一，字节生态全面整合，免费无限制使用+内置绘图/视频能力，用户增长迅猛。',
    trendChange: '+15%',
    trendReason: '字节生态整合加速，日活持续攀升',
  },
  {
    id: 'kimi',
    name: 'Kimi',
    company: '月之暗面',
    url: 'https://kimi.moonshot.cn',
    icon: 'https://statics.moonshot.cn/kimi-chat/favicon.ico',
    category: 'LLM 大模型',
    description: '长文本理解能力突出的国产 AI 助手，支持 200 万字上下文',
    users: '30M+',
    isNew: false,
    isHot: true,
    tags: ['长文本', '阅读', '对话'],
  },
  {
    id: 'tongyi',
    name: '通义千问',
    company: '阿里巴巴',
    url: 'https://tongyi.aliyun.com',
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01AKUdEM1xtMnAXVNiY_!!6000000006502-2-tps-512-512.png',
    category: 'LLM 大模型',
    description: '阿里巴巴大模型产品，整合万相绘图和听悟等能力',
    users: '20M+',
    isNew: false,
    isHot: false,
    tags: ['对话', '办公', '编程'],
  },
  {
    id: 'grok',
    name: 'Grok',
    company: 'xAI',
    url: 'https://grok.x.ai',
    icon: 'https://grok.x.ai/favicon.ico',
    category: 'LLM 大模型',
    description: '马斯克旗下 xAI 的 AI 助手，集成 X 平台实时数据',
    users: '20M+',
    isNew: false,
    isHot: true,
    tags: ['对话', '实时信息', '图像生成'],
  },
  {
    id: 'ernie',
    name: '文心一言',
    company: '百度',
    url: 'https://yiyan.baidu.com',
    icon: 'https://nlp-eb.cdn.bcebos.com/static/eb/asset/logo.8a6b508d.png',
    category: 'LLM 大模型',
    description: '百度大模型产品，文心大模型 4.0 驱动',
    users: '20M+',
    isNew: false,
    isHot: false,
    tags: ['对话', '写作', '搜索'],
  },

  // ===== 图像生成 =====
  {
    id: 'midjourney',
    name: 'Midjourney',
    company: 'Midjourney',
    url: 'https://midjourney.com',
    icon: 'https://cdn.midjourney.com/favicon.ico',
    category: '图像生成',
    description: '最受欢迎的 AI 绘画工具之一，以艺术质感和风格化著称',
    users: '20M+',
    isNew: false,
    isHot: true,
    tags: ['绘画', '艺术', '设计'],
  },
  {
    id: 'dalle',
    name: 'DALL·E 3',
    company: 'OpenAI',
    url: 'https://openai.com/dall-e-3',
    icon: 'https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg',
    category: '图像生成',
    description: '集成于 ChatGPT 中的图像生成模型，理解自然语言描述精准',
    users: '50M+',
    isNew: false,
    isHot: false,
    tags: ['绘画', '文生图'],
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    company: 'Ideogram',
    url: 'https://ideogram.ai',
    icon: 'https://ideogram.ai/favicon.ico',
    category: '图像生成',
    description: '擅长文字渲染的 AI 图像生成工具，文字图像质量业界领先',
    users: '5M+',
    isNew: false,
    isHot: true,
    tags: ['文字渲染', '海报', '设计'],
  },
  {
    id: 'flux',
    name: 'Flux',
    company: 'Black Forest Labs',
    url: 'https://flux1.ai',
    icon: 'https://flux1.ai/favicon.ico',
    category: '图像生成',
    description: '开源图像生成模型，由 Stable Diffusion 原团队打造',
    users: '10M+',
    isNew: false,
    isHot: true,
    tags: ['开源', '文生图', '高质量'],
  },
  {
    id: 'jimeng',
    name: '即梦',
    company: '字节跳动',
    url: 'https://jimeng.jianying.com',
    icon: 'https://lf3-lv-creation.oceanengine.com/obj/lv-creation/favicon.ico',
    category: '图像生成',
    description: '字节旗下 AI 图像/视频创作平台，基于剪映生态',
    users: '15M+',
    isNew: false,
    isHot: true,
    tags: ['绘画', '视频', '创作'],
  },

  // ===== 视频生成 =====
  {
    id: 'sora',
    name: 'Sora',
    company: 'OpenAI',
    url: 'https://sora.com',
    icon: 'https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg',
    category: '视频生成',
    description: 'OpenAI 文生视频模型，可生成长达 1 分钟的高质量视频',
    users: '10M+',
    isNew: false,
    isHot: true,
    tags: ['文生视频', '创意'],
  },
  {
    id: 'kling',
    name: '可灵 Kling',
    company: '快手',
    url: 'https://klingai.kuaishou.com',
    icon: 'https://klingai.kuaishou.com/favicon.ico',
    category: '视频生成',
    description: '快手推出的 AI 视频生成模型，效果获业界高度认可',
    users: '10M+',
    isNew: false,
    isHot: true,
    tags: ['文生视频', '图生视频'],
  },
  {
    id: 'runway',
    name: 'Runway',
    company: 'Runway',
    url: 'https://runwayml.com',
    icon: 'https://runwayml.com/favicon.ico',
    category: '视频生成',
    description: 'AI 视频编辑和生成平台，Gen-3 模型，好莱坞级创作工具',
    users: '5M+',
    isNew: false,
    isHot: true,
    tags: ['视频编辑', '特效', '创作'],
  },
  {
    id: 'hailuo',
    name: '海螺 AI',
    company: 'MiniMax',
    url: 'https://hailuoai.com',
    icon: 'https://hailuoai.com/favicon.ico',
    category: '视频生成',
    description: 'MiniMax 旗下视频生成产品，I2V-01 模型表现优秀',
    users: '5M+',
    isNew: false,
    isHot: true,
    tags: ['视频生成', '图生视频'],
  },
  {
    id: 'vidu',
    name: 'Vidu',
    company: '生数科技',
    url: 'https://www.vidu.com',
    icon: 'https://www.vidu.com/favicon.ico',
    category: '视频生成',
    description: '国产视频生成模型，支持 4 秒到 32 秒视频生成',
    users: '2M+',
    isNew: true,
    isHot: false,
    tags: ['文生视频', '国产'],
  },
  {
    id: 'seedance',
    name: 'Seedance',
    company: '字节跳动',
    url: 'https://seedance.ai',
    icon: 'https://seedance.ai/favicon.ico',
    category: '视频生成',
    description: '字节最新视频生成模型，支持舞蹈、运动等复杂场景',
    users: '2M+',
    isNew: true,
    isHot: true,
    tags: ['视频生成', '舞蹈', '运动'],
  },

  // ===== 编程助手 =====
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    company: 'GitHub / Microsoft',
    url: 'https://github.com/features/copilot',
    icon: 'https://github.githubassets.com/favicons/favicon.svg',
    category: '编程助手',
    description: '最流行的 AI 编程助手，集成于 VS Code / JetBrains 等主流 IDE',
    users: '15M+',
    isNew: false,
    isHot: true,
    tags: ['代码补全', 'IDE', '编程'],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    company: 'Anysphere',
    url: 'https://cursor.com',
    icon: 'https://cursor.com/favicon.ico',
    category: '编程助手',
    description: 'AI-first 代码编辑器，内置对话/编辑/补全，开发者新宠',
    users: '10M+',
    isNew: false,
    isHot: true,
    tags: ['编辑器', 'AI 编程', '对话'],
    trendScore: 93,
    whyHot: 'AI编程领域绝对王者，Composer 2.0模式不仅写代码还能自动运行终端、自动Debug。Tab补全精准到让人害怕，几乎成为全球开发者必装工具。',
    trendChange: '+30%',
    trendReason: 'Composer 2.0 + Agent模式引爆开发者圈',
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    company: 'Codeium',
    url: 'https://windsurf.com',
    icon: 'https://windsurf.com/favicon.ico',
    category: '编程助手',
    description: 'Codeium 推出的 AI IDE，主打 Cascade 流式编程体验',
    users: '3M+',
    isNew: true,
    isHot: true,
    tags: ['IDE', 'AI 编程'],
  },
  {
    id: 'replit',
    name: 'Replit',
    company: 'Replit',
    url: 'https://replit.com',
    icon: 'https://replit.com/public/icons/favicon-196.png',
    category: '编程助手',
    description: '云端 AI 编程平台，支持自然语言创建完整应用',
    users: '30M+',
    isNew: false,
    isHot: true,
    tags: ['云端', '全栈', '部署'],
  },
  {
    id: 'v0',
    name: 'v0',
    company: 'Vercel',
    url: 'https://v0.dev',
    icon: 'https://v0.dev/favicon.ico',
    category: '编程助手',
    description: 'Vercel 出品的 AI UI 生成工具，用自然语言生成 React 组件',
    users: '5M+',
    isNew: false,
    isHot: true,
    tags: ['UI 生成', 'React', '前端'],
  },
  {
    id: 'bolt',
    name: 'Bolt.new',
    company: 'StackBlitz',
    url: 'https://bolt.new',
    icon: 'https://bolt.new/favicon.ico',
    category: '编程助手',
    description: '浏览器内全栈 AI 开发环境，一句话生成可运行的完整应用',
    users: '5M+',
    isNew: false,
    isHot: true,
    tags: ['全栈', '浏览器开发'],
  },
  {
    id: 'trae',
    name: 'Trae',
    company: '字节跳动',
    url: 'https://trae.ai',
    icon: 'https://trae.ai/favicon.ico',
    category: '编程助手',
    description: '字节推出的免费 AI IDE，基于 VS Code，内置 Claude / GPT',
    users: '2M+',
    isNew: true,
    isHot: true,
    tags: ['IDE', '免费', 'AI 编程'],
    trendScore: 84,
    whyHot: '国产AI IDE之光，完全免费+内置Claude/GPT顶级模型。对中文语义理解无敌，Builder Mode对微信小程序/Vue3等国内框架优化极好，学生党和国内开发者首选。',
    trendChange: '+85%',
    trendReason: '免费+中文优化，国内开发者首选IDE',
  },
  {
    id: 'devin',
    name: 'Devin',
    company: 'Cognition',
    url: 'https://devin.ai',
    icon: 'https://devin.ai/favicon.ico',
    category: '编程助手',
    description: '全球首个 AI 软件工程师，可自主完成复杂开发任务',
    users: '1M+',
    isNew: true,
    isHot: true,
    tags: ['AI Agent', '自主编程'],
  },
  {
    id: 'lovable',
    name: 'Lovable',
    company: 'Lovable',
    url: 'https://lovable.dev',
    icon: 'https://lovable.dev/favicon.ico',
    category: '编程助手',
    description: '全栈 AI 工程师，用自然语言快速构建生产级 Web 应用',
    users: '2M+',
    isNew: true,
    isHot: true,
    tags: ['全栈', 'Web 应用'],
  },

  // ===== 设计工具 =====
  {
    id: 'canva-ai',
    name: 'Canva AI',
    company: 'Canva',
    url: 'https://canva.com',
    icon: 'https://static.canva.com/static/images/favicon-1.ico',
    category: '设计工具',
    description: 'Canva 内置 AI 功能套件，AI 绘图、文案、视频一站式设计',
    users: '190M+',
    isNew: false,
    isHot: true,
    tags: ['平面设计', '模板', '视频'],
  },
  {
    id: 'figma-ai',
    name: 'Figma AI',
    company: 'Figma',
    url: 'https://figma.com',
    icon: 'https://static.figma.com/app/icon/1/favicon.svg',
    category: '设计工具',
    description: 'Figma 内置 AI 功能，自动布局、智能建议、AI 原型生成',
    users: '30M+',
    isNew: false,
    isHot: true,
    tags: ['UI 设计', '原型', '协作'],
  },
  {
    id: 'motiff',
    name: 'Motiff 妙多',
    company: '猿辅导',
    url: 'https://motiff.com',
    icon: 'https://motiff.com/favicon.ico',
    category: '设计工具',
    description: 'AI 驱动的 UI 设计工具，智能设计系统、AI 组件识别',
    users: '1M+',
    isNew: true,
    isHot: true,
    tags: ['UI 设计', '智能布局'],
  },
  {
    id: 'galileo',
    name: 'Galileo AI',
    company: 'Galileo AI',
    url: 'https://www.usegalileo.ai',
    icon: 'https://www.usegalileo.ai/favicon.ico',
    category: '设计工具',
    description: '用自然语言描述生成高保真 UI 设计稿，设计师效率工具',
    users: '1M+',
    isNew: false,
    isHot: true,
    tags: ['UI 生成', '文生设计'],
  },

  // ===== AI Agent =====
  {
    id: 'coze',
    name: 'Coze / 扣子',
    company: '字节跳动',
    url: 'https://www.coze.com',
    icon: 'https://lf-coze-web-cdn.coze.com/obj/coze-web-cn/obric/coze/favicon.1970.png',
    category: 'AI Agent',
    description: '低代码 AI Bot 构建平台，可创建对话机器人并发布到各平台',
    users: '20M+',
    isNew: false,
    isHot: true,
    tags: ['Bot 构建', '低代码', '工作流'],
  },
  {
    id: 'dify',
    name: 'Dify',
    company: 'Dify',
    url: 'https://dify.ai',
    icon: 'https://dify.ai/favicon.ico',
    category: 'AI Agent',
    description: '开源 LLM 应用开发平台，可视化构建 AI 工作流和 Agent',
    users: '5M+',
    isNew: false,
    isHot: true,
    tags: ['开源', '工作流', 'RAG'],
  },
  {
    id: 'manus',
    name: 'Manus',
    company: 'Manus AI',
    url: 'https://manus.im',
    icon: 'https://manus.im/favicon.ico',
    category: 'AI Agent',
    description: '通用 AI Agent，可自主完成复杂任务如研究、数据分析等',
    users: '2M+',
    isNew: true,
    isHot: true,
    tags: ['通用 Agent', '任务执行'],
    trendScore: 86,
    whyHot: '首个刷屏级通用AI Agent，可自主完成研究报告、数据分析、网页操作等复杂任务。发布时一码难求，引发全网讨论"AI Agent元年是否到来"。',
    trendChange: '+120%',
    trendReason: '通用Agent标杆产品，引发行业热潮',
  },
  {
    id: 'openai-operator',
    name: 'Operator',
    company: 'OpenAI',
    url: 'https://operator.chatgpt.com',
    icon: 'https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg',
    category: 'AI Agent',
    description: 'OpenAI 的浏览器操作 Agent，可自动执行网页操作任务',
    users: '5M+',
    isNew: true,
    isHot: true,
    tags: ['浏览器控制', '自动化'],
  },

  // ===== 效率工具 =====
  {
    id: 'notion-ai',
    name: 'Notion AI',
    company: 'Notion',
    url: 'https://notion.so',
    icon: 'https://www.notion.so/images/favicon.ico',
    category: '效率工具',
    description: 'Notion 内置 AI 写作/总结/翻译/头脑风暴助手',
    users: '35M+',
    isNew: false,
    isHot: true,
    tags: ['写作', '笔记', '知识库'],
  },
  {
    id: 'gamma',
    name: 'Gamma',
    company: 'Gamma',
    url: 'https://gamma.app',
    icon: 'https://gamma.app/favicon.ico',
    category: '效率工具',
    description: 'AI 驱动的演示文稿/文档工具，一句话生成精美 PPT',
    users: '10M+',
    isNew: false,
    isHot: true,
    tags: ['PPT', '文档', '演示'],
  },
  {
    id: 'napkin',
    name: 'Napkin AI',
    company: 'Napkin AI',
    url: 'https://napkin.ai',
    icon: 'https://napkin.ai/favicon.ico',
    category: '效率工具',
    description: '将文字自动转换为专业图表和信息图的 AI 工具',
    users: '2M+',
    isNew: true,
    isHot: true,
    tags: ['图表', '信息图', '可视化'],
  },

  // ===== 搜索引擎 =====
  {
    id: 'perplexity',
    name: 'Perplexity',
    company: 'Perplexity AI',
    url: 'https://perplexity.ai',
    icon: 'https://www.perplexity.ai/favicon.ico',
    category: '搜索引擎',
    description: 'AI 驱动的智能搜索引擎，直接给出带引用的答案',
    users: '15M+',
    isNew: false,
    isHot: true,
    tags: ['搜索', 'AI 问答', '引用'],
  },
  {
    id: 'tiangong',
    name: '天工 AI',
    company: '昆仑万维',
    url: 'https://www.tiangong.cn',
    icon: 'https://www.tiangong.cn/favicon.ico',
    category: '搜索引擎',
    description: '国产 AI 搜索引擎，结合大模型与实时搜索能力',
    users: '5M+',
    isNew: false,
    isHot: false,
    tags: ['搜索', 'AI 问答'],
  },

  // ===== 音频语音 =====
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    company: 'ElevenLabs',
    url: 'https://elevenlabs.io',
    icon: 'https://elevenlabs.io/favicon.ico',
    category: '音频语音',
    description: '最先进的 AI 语音合成平台，支持声音克隆和多语言',
    users: '10M+',
    isNew: false,
    isHot: true,
    tags: ['语音合成', 'TTS', '声音克隆'],
  },
  {
    id: 'suno',
    name: 'Suno',
    company: 'Suno',
    url: 'https://suno.com',
    icon: 'https://suno.com/favicon.ico',
    category: '音频语音',
    description: '用文字描述生成完整歌曲（含人声），AI 音乐创作新秀',
    users: '12M+',
    isNew: false,
    isHot: true,
    tags: ['音乐生成', '歌曲', '创作'],
  },
  {
    id: 'udio',
    name: 'Udio',
    company: 'Udio',
    url: 'https://udio.com',
    icon: 'https://udio.com/favicon.ico',
    category: '音频语音',
    description: 'AI 音乐创作平台，音质和多样性表现出色',
    users: '5M+',
    isNew: false,
    isHot: true,
    tags: ['音乐生成', '创作'],
  },
  {
    id: 'notebooklm',
    name: 'NotebookLM',
    company: 'Google',
    url: 'https://notebooklm.google.com',
    icon: 'https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png',
    category: '效率工具',
    description: 'Google 的 AI 笔记工具，可将文档转为播客，深度理解资料',
    users: '10M+',
    isNew: false,
    isHot: true,
    tags: ['笔记', '播客', '文档理解'],
  },
];

/**
 * 所有产品分类
 */
const CATEGORIES = [
  { key: 'all', label: '全部', icon: '🔥' },
  { key: 'LLM 大模型', label: 'LLM 大模型', icon: '🧠' },
  { key: '图像生成', label: '图像生成', icon: '🎨' },
  { key: '视频生成', label: '视频生成', icon: '🎬' },
  { key: '编程助手', label: '编程助手', icon: '💻' },
  { key: '设计工具', label: '设计工具', icon: '✏️' },
  { key: 'AI Agent', label: 'AI Agent', icon: '🤖' },
  { key: '效率工具', label: '效率工具', icon: '⚡' },
  { key: '搜索引擎', label: '搜索引擎', icon: '🔍' },
  { key: '音频语音', label: '音频语音', icon: '🎵' },
];

/**
 * 获取基于日期的"每日推荐"排序
 * 使用日期作为种子，保证同一天排序一致，不同天排序不同
 */
function getDailySeed() {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

function shuffleWithSeed(arr, seed) {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function useAIProducts() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const updateTimestamp = useCallback(() => {
    const now = new Date();
    setLastUpdated(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    );
  }, []);

  useEffect(() => {
    updateTimestamp();
  }, [updateTimestamp]);

  const getProducts = useCallback(() => {
    const seed = getDailySeed();
    // 先按热度排序：isHot && isNew > isHot > isNew > 其他，然后同等级内用每日种子打散
    const sorted = [...AI_PRODUCTS].sort((a, b) => {
      const scoreA = (a.isHot ? 2 : 0) + (a.isNew ? 1 : 0);
      const scoreB = (b.isHot ? 2 : 0) + (b.isNew ? 1 : 0);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return 0;
    });

    // 对同分段内的产品进行每日 shuffle
    const groups = {};
    sorted.forEach((p) => {
      const score = (p.isHot ? 2 : 0) + (p.isNew ? 1 : 0);
      if (!groups[score]) groups[score] = [];
      groups[score].push(p);
    });

    let result = [];
    Object.keys(groups)
      .sort((a, b) => b - a)
      .forEach((score) => {
        result = result.concat(shuffleWithSeed(groups[score], seed + parseInt(score)));
      });

    return result;
  }, []);

  const products = getProducts();

  const filtered = products.filter((p) => {
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.includes(searchQuery) ||
      p.tags.some((t) => t.includes(searchQuery));
    return matchCat && matchSearch;
  });

  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.key] = cat.key === 'all' ? products.length : products.filter((p) => p.category === cat.key).length;
    return acc;
  }, {});

  // 热度排行榜：取有 trendScore 的产品，按分数降序排列，取前10
  const trendingProducts = products
    .filter((p) => p.trendScore)
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, 10);

  return {
    products: filtered,
    allProducts: products,
    trendingProducts,
    categories: CATEGORIES,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    categoryCounts,
    lastUpdated,
    totalCount: products.length,
    refreshProducts: updateTimestamp,
  };
}
