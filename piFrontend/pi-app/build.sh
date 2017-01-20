ember build
#ember build --environment=production
rm -rf ~/pi_projects/piWebserver/assets
cp -r dist/* ~/pi_projects/piWebserver/
