rm & add origin

```
git remote -v // 查看git对应的远程仓库地址
git remote rm origin // 删除关联对应的远程仓库地址
git remote -v // 查看是否删除成功，如果没有任何返回结果，表示OK
git remote add origin "新的仓库地址" // 重新关联git远程仓库地址
```
set-url

```
git remote // 查看远程仓库名称：origin
git remote get-url origin // 查看远程仓库地址
git remote set-url origin "新的仓库地址" // ( 如果未设置ssh-key，此处仓库地址为 http://... 开头)
```
