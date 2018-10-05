echo "Must assign executable status and other permissions to encasing folder or just executable files before using script file:"
echo "chmod 700 rtsupportclient-master"
echo "chmod 700 ReactGoMooreD.sh"
echo "ls -lA"
echo "Execute script file ReactGoMooreD.sh from ReactGoMooreC terminal file folder:"
echo "./ReactGoMooreD.sh"

cd rtsupportclient-master

source /home/ralph/go/.bash_profile


echo "webpack ./index.js bundle.js"

echo "export PATH=/snap/bin  serve "

echo "Above commands from Moore course don't work, following is substitution of webpack from SGrider course to generate an executable html file:"

echo "Erase webpack global install as it may be a disruption of locally installed specific webpack version:"

npm uninstall webpack -g

echo "Remove initial installation files and reinstall for clean reconstruction of application:"

rm -rf dist

rm -rf node_modules

echo "Install npm node_module folder for generation of local build file: "

npm install

echo "Install local build file with webpack using npm run command located in package.json file:"

npm run build

echo "Generate a server to serve up an .html file on the port localhost:9999"

pushd index.html; python3 -m http.server 9999; popd;