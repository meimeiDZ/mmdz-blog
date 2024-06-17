# SoraWebui

### 项目介绍[SoraWebui]

> 先说 SoraWebui，这是一个开源的 Sora AI 视频生成 Web 客户端，可以认为是对标 GPT 客户端。
>
> 项目提供了一个部署的演示站点：**https://sorawebui.com**
>
> ![](imgs\SoraWebui_01.jpg)
>
> 输入提示词，点击“生成”按键即可生成视频。
>
> 试了下，流程貌似能走通，但其实不是真的在生成视频的。
>
> 只是调用了一个假的 api，从官方的demo视频库里面，根据提示词选了一个最合适视频的而已。
>
> 这个调用的假的 api 就是下面介绍的第二个开源项目。

### 开源api[FakeSoraAPI]

> 同样也提供了一个项目部署的演示站点：**https://fake-sora-api.sorawebui.com/**
>
> 这个项目介绍说是 SoraWebui 的接口，调用此 API 以从文本生成视频。
>
> ![](imgs\SoraWebui_02.jpg)
>
> 结合第一个SoraWebui，即时后面不是开发开发 Sora 相关的产品，还是可以走通文字生成视频的过程。
>
> 虽然还没有发布使用sora，完全也不影响相关的产品开发。

### 项目资料

> 项目地址：**https://github.com/SoraWebui/SoraWebui**
> 项目地址：**https://github.com/SoraWebui/FakeSoraAPI**

### 最后

> 关于Sora，整理了一些关于 Sora 学习的资料，包括相关介绍、优势特色、demo演示视频、变现思路玩法等等
>
> 资料地址：<a href="/docs/Website/sora学习资料汇总.html" target="_blank">sora学习资料汇总</a>