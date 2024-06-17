# xxl-job

> [!Tip]
>
> 官方文档：[分布式任务调度平台XXL-JOB](https://www.xuxueli.com/xxl-job/)、[github](https://github.com/xuxueli/xxl-job)、[gitee](http://gitee.com/xuxueli0323/xxl-job)

------



### Docker部署

> - 在执行之前因为xxl-job需要做数据持久化，所以这边需要先创建一个对应的数据库并进行初始化
>
>   [gitee 地址 xxl_job.sql · 许雪里/xxl-job 版本2.4.0](https://gitee.com/xuxueli0323/xxl-job/blob/2.4.0/doc/db/tables_xxl_job.sql)
>
> - docker-compose.yml
>
>   ```yml
>   version: "3"
>   services:
>     xxl-job-admin:
>       restart: always
>       image: xuxueli/xxl-job-admin:2.4.0
>       container_name: xxl-job-admin
>       volumes:
>         - /home/xxl-job/logs:/data/applogs
>       ports:
>         - "8800:8800"
>       environment:
>         PARAMS: '
>         --server.port=8800
>         --server.servlet.context-path=/xxl-job-admin
>         --spring.datasource.url=jdbc:mysql://192.168.204.100:3306/xxl_job?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
>         --spring.datasource.username=root
>         --spring.datasource.password=123456
>         --xxl.job.accessToken=mmdz_default_token'
>   ```
>
> - 访问
>
>   程序正常运行之后 输入 http://ip:8800/xxl-job-admin/
>
>   进行访问 admin/123456 初始账户密码

