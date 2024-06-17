# CI/CD

## 概念

> - 持续集成(Continuous Integration, CI): 代码合并，构建，部署，测试都在一起，不断地执行这个过程，并对结果反馈。
>
> - 持续部署(Continuous Deployment, CD):　部署到测试环境、预生产环境/灰度环境、生产环境。
>
> - 持续交付(Continuous Delivery, CD): 将最终产品发布到生产环境、给用户使用。



## 部署应用 Jenkins+GitLab

> - 上传Jdk
>
>   ```bash
>   [root@mmdz-boot ~]# java -version
>   java version "1.8.0_301"
>   Java(TM) SE Runtime Environment (build 1.8.0_301-b09)
>   Java HotSpot(TM) 64-Bit Server VM (build 25.301-b09, mixed mode)
>   [root@mmdz-boot ~]# 
>   ```
>
> - 安装Maven
>
>   ```bash
>   [root@mmdz-boot ~]# mvn -v
>   Apache Maven 3.8.1 (05c21c65bdfed0f71a2f2ada8b84da59348c4c5d)
>   Maven home: /home/maven/maven-3.8.1
>   Java version: 1.8.0_301, vendor: Oracle Corporation, runtime: /home/jdk/jdk1.8.0_301/jre
>   Default locale: zh_CN, platform encoding: UTF-8
>   OS name: "linux", version: "3.10.0-862.el7.x86_64", arch: "amd64", family: "unix"
>   [root@mmdz-boot ~]# 
>   ```
>
> - 安装Git
>
>   ```bash
>   # 第一步，官网下载安装包
>   https://github.com/git/git/releases
>   
>   # 第二步，解压安装包
>   tar -zxvf git-2.45.0.tar.gz 
>   
>   # 第三步，安装编译环境
>   yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel gcc perl-ExtUtils-MakeMaker
>   
>   ### 注意（安装上面编译环境的时候，yum自动帮你安装了git，这时候你需要先卸载这个旧版的git。否则还是一个老版本）
>   git --version
>   
>   yum remove git
>   
>   # 第四步，编译源码 (进入cd /home/git/git-2.45.0)
>   make prefix=/home/git all
>   ### 注意（时间挺长）
>   
>   # 第五步，安装git
>   make prefix=/home/git install
>   
>   # 第六步，配置环境变量
>   vim /etc/profile
>   
>   ### 刷新配置文件
>   source /etc/profile
>   ```
>
> - 部署GitLab
>
>   **注意：本次安装基于docker-compose来安装 (内存 至少4G)**
>
>   **部署规划**
>
>   | 服务器IP         | 192.168.113.48    |
>   | ---------------- | ----------------- |
>   | 端口             | 9999              |
>   | 安装目录         | /home/gitlab      |
>   | 数据映射目录     | /home/gitlab/data |
>   | 配置文件映射目录 | /home/gitlab/conf |
>   | 日志文件映射目录 | /home/gitlab/logs |
>
>   - docker-compose.yaml
>
>     ```bash
>     version: '3'
>     services:
>       gitlab:
>         restart: always
>         image: gitlab/gitlab-ce:latest
>         container_name: gitlab
>         environment:
>           TZ: 'Asia/Shanghai'
>           GITLAB_OMNIBUS_CONFIG: |
>             # 访问gitlab-ce的完整地址，web站点访问地址(若有域名可以写域名)
>             external_url 'http://192.168.204.101:9999'
>             gitlab_rails['time_zone'] = 'Asia/Shanghai'
>         ports:
>           - '9999:9999' # 注意宿主机和容器内部的端口要一致，否则external_url无法访问
>           - '30443:443' # web监听端口映射
>           - '30022:22' # ssh监听端口映射
>         volumes:
>           - './conf:/etc/gitlab'
>           - './logs:/var/log/gitlab'
>           - './data:/var/opt/gitlab'
>     ```
>
>   - 构建容器  `docker-compose up -d`
>
>   - 查看容器
>
>     ```bahs
>     [root@mmdz-boot ~]# docker ps
>     CONTAINER ID   IMAGE                     COMMAND                   CREATED          STATUS                    PORTS                                                                                                                                   NAMES
>     6e8860084c96   gitlab/gitlab-ce:latest   "/assets/wrapper"           11 minutes ago    Up 11 minutes (healthy)    80/tcp, 0.0.0.0:9999->9999/tcp, :::9999->9999/tcp, 0.0.0.0:30022->22/tcp, :::30022->22/tcp, 0.0.0.0:30443->443/tcp, :::30443->443/tcp      		 gitlab
>     c9cdaadfe977   redis:6.2.5               "docker-entrypoint.s…"      2 days ago       Up About an hour           0.0.0.0:6379->6379/tcp, :::6379->6379/tcp                                                                                                  mmdz-redis
>     [root@mmdz-boot ~]# 
>     ```
>
>   - 验证GitLab  `http://192.168.204.101:9999/`
>
>     *若进入浏览器后若出现502页面，不要着急，多刷新几次，出现502是因为GitLab服务还在准备当中。*
>
>     *容器起来之后，默认用户是`root`，要登录web界面需要先进入容器的这个文件获取密码：*
>
>     ```bash
>     [root@mmdz-boot gitlab]# docker exec -it gitlab bash
>     root@6e8860084c96:/# cat /etc/gitlab/initial_root_password
>     https://docs.gitlab.com/ee/security/reset_user_password.html#reset-your-root-password.
>     
>     Password: ab86d8t4IEAlPzWteIraHCeb9HC/Lsqwywpph+N6TTg=
>     
>     root@6e8860084c96:/# 
>     ```
>
>   - 测试
>
>     ```shell
>     # 1、密码修改成功后会跳到登录页面，首次登录，用户名为 root，密码为刚才设置的密码。
>     
>     # 2、设置中文 (setting -> Preferences -> Localization)
>     
>     # 3、注册一个新用户，并使用该用户登录创建一个测试项目
>     ```
>
> - 部署Jenkins
>
>   - docker-compose.yaml
>
>     ```yaml
>     version: '3'
>     services:
>       jenkins:
>         restart: always
>         image: jenkins/jenkins:latest
>         container_name: jenkins
>         environment:
>           - TZ=Asia/Shanghai
>         volumes:
>           - /home/jenkins/jenkins_home:/var/jenkins_home
>           - /var/run/docker.sock:/var/run/docker.sock
>           - /usr/bin/docker:/usr/bin/docker
>           - /usr/lib/x86_64-linux-gnu/libltdl.so.7:/usr/lib/x86_64-linux-gnu/libltdl.so.7
>         ports:
>           - "9000:8080"
>         expose:
>           - "9000"
>           - "50000"
>     ```
>
>   - 需要修改下目录权限
>
>     ```bash
>     # 因为当映射本地数据卷时，/home/docker/jenkins目录的拥有者为root用户，而容器中jenkins user的uid为1000，执行如下命令即可：
>     
>     [root@mmdz-boot jenkins]# chown -R 1000:1000 /home/jenkins
>     
>     # 构建容器
>     [root@mmdz-boot jenkins]# docker-compose up -d
>     ```
>
>   - 访问Jenkins
>
>     ```bash
>     # 在浏览器中输入:http://192.168.204.101:9000/  访问jenkins
>     
>     # 日志查看，初始密码
>     docker logs jenkins
>     
>     # 安装插件（安装推荐）
>     ### 出现的问题：很多插件安装失败，原因：版本太低。（解决方法：1、切换下载源地址 2、更新版本）
>     
>     # 安装完成后，创建管理用户
>     
>     # 配置jenkins全局工具（在jenkins系统配置的全局工具配置中填写jdk的安装路径，本地git命令的路径，maven的安装路径）
>     
>     # Jenkins的插件管理（查看插件是否安装）
>     ### 说明：安装好jenkins，什么也干不了，jenkins相当于一个平台，安装什么样的插件，实现什么样的功能，功能的实现依赖于插件
>     
>     
>     ```
>
>     !> 使用Docker安装Jenkins，解决插件安装失败，版本太低等问题
>
>      *yum 更新到最新 -->  最后的版本号一定要带，指定下载具体的版本号（docker pull jenkins/jenkins:2.426.1）*
>
> - 
