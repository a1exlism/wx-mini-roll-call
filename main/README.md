## Refer
[API文档](https://leancloud.cn/docs/leanstorage_guide-js.html)
由此可不需要直接创建class, 所以直接使用api进行操作.

## LeanCloud 数据库结构

\_User
---
结合微信API 默认生成, 没有额外变动.

RegRecords
---
用于记录签到表的相关信息
| 字段       | 描述 |
| :-------  | :-- |
| id        | 唯一索引,自增 |
| tableName | 签到表表名: objectId_No 格式 |
| displayName| 签到表显示名 |
| creatorId | 创建者ID |
| createAt  | 生效时间timestamp, 自定义则使用13位 |
| delay     | 允许迟到时间(分) |
| longitude | 经度 |
| latitude  | 纬度 |
| joinCode  | 签到码 |

输入joinCode进行签到, 在签到时会请求签到者location信息并结合时间进行限制.

tableName, 例如表: `5444b35ea22b0000443f0000_1`
---
| 字段       | 描述 |
| :-------  | :-- |
| userId    | 用户唯一id(_User) |
| studentNo | 学号(默认为验证信息) |
| signTime  | 签到时间 |
| longitude | 经度 |
| latitude  | 纬度 |
