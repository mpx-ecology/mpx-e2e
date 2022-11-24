#!/bin/bash
BRANCH=`git branch -a|grep '.*\*'|sed 's/[*[:space:]]*//g'` # 当前分支
STATUS=`git status --porcelain` # working tree
if [ "$STATUS" ]; then
  echo "❗️请先清理 workingtree 后再进行发布！"
  echo ""
  exit 1
fi

# build clent
echo "正在打包Client..."
cd report-client
read -r -p "report-client是否需要npm i? [Y/n] " input
 
case $input in
    [yY][eE][sS]|[yY])
        npm ci
        ;;
 
    [nN][oO]|[nN])
        echo "No"
           ;;
    *)
esac
npm run build

cd ..
# npm ci
# npm run build

sleep 3

if [ -z "$1" ]; then
  type='prerelease'
else
  type=$1
fi

if [ $BRANCH != "master" ] && [ $type == "patch" ]
then
  echo 'error: 请在master上发布patch版本!'
  exit 1
fi

echo "正在发包npm..."
npm version $type -m '[release] '$type': @%s' && npm publish --registry=https://registry.npmjs.org/ --access=public
# echo [ $? -eq 0 ]
# then
#   PACKAGE_VERSION=$(cat package.json \
#         | grep version \
#         | head -1 \
#         | awk -F: '{ print $2 }' \
#         | sed 's/[",]//g')

#   git push origin $BRANCH:$BRANCH
# fi
STAT=$?
if [ $STAT == 0 ]
then
  echo 'success: 发包成功！请手动提交你的代码'
else
  echo 'error: 发包失败！请重新执行：npm publish --registry=https://registry.npmjs.org/ --access=public'
fi

echo '执行完成'
