#!/bin/bash

BRANCH=`git branch -a|grep '.*\*'|sed 's/[*[:space:]]*//g'` # 当前分支
STATUS=`git status --porcelain` # working tree
git checkout .
if [ "$STATUS" ]; then
  echo "❗️请先清理 workingtree 后再进行发布！"
  echo ""
  exit 1
fi

# build clent
echo "正在打包Client..."
cd report-client
# npm ci
npm run build

# build server
# echo "正在打包Server..."
# cd ..
# npm ci
# npm run build

if [ -z "$1" ]; then
  type='prerelease'
else
  type=$1
fi

if [ $BRANCH != "master" ] && [ $type == "patch" ]
then
  echo 'error: 请在master上发布path版本!'
  exit 1
fi

echo "正在发包npm..."
npm version $type -m '[release] '$type': @%s' && npm publish --registry=https://registry.npmjs.org/ --access=public

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

git push origin $BRANCH:$BRANCH
