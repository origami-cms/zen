# Remove all root directories that are built from /src/* root directories
for d in src/*; do
  dir=`basename $d`
  echo Removing ./$dir
  rm -rf ./$dir
done
