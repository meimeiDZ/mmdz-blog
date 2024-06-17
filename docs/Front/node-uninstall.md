# Node卸载

> 1. 打开系统的控制面板，点击卸载程序，卸载nodejs（使用压缩包的跳过此步骤）
>
> 2. 删除node的安装目录
>
>    `默认是C:\Program Files\nodejs，也可能在其他盘，主要取决于安装时的选择。`
>
>    查看该路径下是否有node文件，我这里已经没有了，在控制面板卸载node后一般会自动删除node文件，如果文件还在的话就手动删除。
>
> 3. 查找.npmrc文件是否存在，有就删除
>
>    `默认在C:\User\用户名`
>
> 4. 逐一查看一下文件是否存在，存在就删除（AppData 是隐藏目录）
>
>    `C:\Program Files (x86)\Nodejs`
>    `C:\Program Files\Nodejs`
>    `C:\Users\用户名\AppData\Roaming\npm`
>    `C:\Users\用户名\AppData\Roaming\npm-cache`
>
> 5. 打开系统设置，检查系统环境变量，将node相关的配置都删掉
>
>    `一般系统会自动把node环境变量删掉了，可以不用管这步。`
>
>    环境变量打开方式：我的电脑->属性->高级->环境变量->
>    用户变量的Path删除->系统变量的NODE_PATH里的node删掉
>
> 6. 查看是否删除成功
>
>    `在键盘上按下win + R ，输入cmd ，然后点击回车键，在命令行中输入node -v`